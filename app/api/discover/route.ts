import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movie';
  const year = searchParams.get('year') || '';
  const genre = searchParams.get('genre') || '';
  const page = searchParams.get('page') || '1';

  if (!TMDB_API_KEY) {
    return NextResponse.json({ results: [], error: 'API key not configured' });
  }

  const cacheKey = `discover:${type}:${year}:${genre}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', 'X-Cache': 'HIT' },
    });
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      sort_by: 'popularity.desc',
      page,
    });
    if (year) params.set('primary_release_year', year);
    if (genre) params.set('with_genres', genre);

    const endpoint = type === 'tv' ? '/discover/tv' : '/discover/movie';
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${params}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();
    const withType = {
      ...data,
      results: (data.results || []).map((item: Record<string, unknown>) => ({
        ...item,
        media_type: type,
      })),
    };

    cache.set(cacheKey, { data: withType, timestamp: Date.now() });
    if (cache.size > 200) {
      const now = Date.now();
      for (const [key, val] of cache.entries()) {
        if (now - val.timestamp > CACHE_TTL) cache.delete(key);
      }
    }

    return NextResponse.json(withType, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', 'X-Cache': 'MISS' },
    });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
