import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Cache duration: 24 hours for trailers (they rarely change)
const TRAILER_CACHE_DURATION = 86400;

// Cached trailer fetch - shared across all users
const getTrailerKey = unstable_cache(
  async (id: string, type: string): Promise<string | null> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/videos?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: TRAILER_CACHE_DURATION } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const videos: { key: string; site: string; type: string }[] = data.results || [];

    const trailer =
      videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
      videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
      videos.find((v) => v.site === 'YouTube');

    return trailer?.key || null;
  },
  ['trailer'],
  {
    revalidate: TRAILER_CACHE_DURATION,
    tags: ['trailers'],
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'movie';

  if (!TMDB_API_KEY || !id) {
    return NextResponse.json({ key: null });
  }

  try {
    const key = await getTrailerKey(id, type);
    return NextResponse.json(
      { key },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch {
    return NextResponse.json({ key: null });
  }
}
