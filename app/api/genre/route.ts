import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get('genreId');
  const type = searchParams.get('type') || 'movie';
  const page = searchParams.get('page') || '1';

  if (!TMDB_API_KEY) {
    return NextResponse.json({ results: [], error: 'API key not configured' });
  }

  try {
    const url = genreId
      ? `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
      : `${TMDB_BASE_URL}/${type}/popular?api_key=${TMDB_API_KEY}&page=${page}`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [] });
  }
}
