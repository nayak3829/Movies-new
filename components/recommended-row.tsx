'use client';

import { useEffect, useState } from 'react';
import { MovieRow } from '@/components/movie-row';
import type { WatchHistoryItem } from '@/components/continue-watching';
import type { Movie } from '@/lib/tmdb';

export function RecommendedRow() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [dominantType, setDominantType] = useState<'movie' | 'tv'>('movie');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const history: WatchHistoryItem[] = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      if (history.length < 1) return;

      const tvCount = history.filter(h => h.media_type === 'tv').length;
      const movieCount = history.filter(h => h.media_type === 'movie').length;
      const type = tvCount > movieCount ? 'tv' : 'movie';
      setDominantType(type);

      const endpoint = type === 'tv'
        ? '/api/genre?type=tv'
        : '/api/genre?type=movie';

      fetch(endpoint)
        .then(r => r.json())
        .then(data => {
          if (data.results?.length) {
            const watched = new Set(history.map(h => h.id));
            const filtered = data.results.filter((m: Movie) => !watched.has(m.id));
            setMovies(filtered.slice(0, 20));
          }
        })
        .catch(() => {});
    } catch {}
  }, []);

  if (!isMounted || movies.length === 0) return null;

  return (
    <MovieRow
      title={`Recommended for You — ${dominantType === 'tv' ? 'TV Shows' : 'Movies'}`}
      movies={movies}
    />
  );
}
