'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, ChevronDown } from 'lucide-react';
import { Movie } from '@/lib/tmdb';

const YEARS = ['2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015'];

const GENRES_MOVIE = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' },
];

const GENRES_TV = [
  { id: '10759', name: 'Action & Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '10762', name: 'Kids' },
  { id: '9648', name: 'Mystery' },
  { id: '10763', name: 'News' },
  { id: '10764', name: 'Reality' },
  { id: '10765', name: 'Sci-Fi & Fantasy' },
  { id: '10766', name: 'Soap' },
  { id: '10767', name: 'Talk' },
  { id: '10768', name: 'War & Politics' },
  { id: '37', name: 'Western' },
];

export function ContentFilter() {
  const [type, setType] = useState('movie');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const genres = type === 'tv' ? GENRES_TV : GENRES_MOVIE;

  const fetchContent = useCallback(async (resetPage = true) => {
    setIsLoading(true);
    const currentPage = resetPage ? 1 : page + 1;
    try {
      const params = new URLSearchParams({ type, page: String(currentPage) });
      if (year) params.set('year', year);
      if (genre) params.set('genre', genre);
      const res = await fetch(`/api/discover?${params}`);
      const data = await res.json();
      if (resetPage) {
        setResults(data.results || []);
        setPage(1);
      } else {
        setResults(prev => [...prev, ...(data.results || [])]);
        setPage(currentPage);
      }
      setHasMore((data.page || 1) < (data.total_pages || 1));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [type, year, genre, page]);

  useEffect(() => {
    if (isOpen) fetchContent(true);
  }, [type, year, genre, isOpen]);

  const genreLabel = genres.find(g => g.id === genre)?.name || 'Genre';
  const activeFilters = (year ? 1 : 0) + (genre ? 1 : 0) + (type !== 'movie' ? 1 : 0);

  return (
    <div className="px-4 md:px-12 mb-2">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 rounded-xl text-sm text-white/80 transition-all mb-3"
      >
        <Filter className="w-4 h-4 text-red-500" />
        <span className="font-medium">Browse & Filter</span>
        {activeFilters > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
            {activeFilters}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="space-y-4">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Type */}
            <select
              value={type}
              onChange={e => { setType(e.target.value); setGenre(''); }}
              className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm cursor-pointer focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>

            {/* Year */}
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm cursor-pointer focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="">Any Year</option>
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Genre */}
            <select
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm cursor-pointer focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="">Any Genre</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            {activeFilters > 0 && (
              <button
                onClick={() => { setYear(''); setGenre(''); setType('movie'); }}
                className="px-3 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-600/30 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results */}
          {isLoading && results.length === 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-lg bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
                {results.map(item => (
                  <Link
                    key={item.id}
                    href={`/${item.media_type === 'tv' ? 'tv' : 'movie'}/${item.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 border border-white/5 group-hover:border-white/20 transition-all group-hover:scale-105 shadow-md">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                          alt={item.title || item.name || ''}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs text-center p-2">
                          No Image
                        </div>
                      )}
                      {item.vote_average > 0 && (
                        <div className="absolute top-1 left-1 bg-black/70 text-yellow-400 text-[10px] font-bold px-1 py-0.5 rounded">
                          ⭐ {item.vote_average.toFixed(1)}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-[10px] font-medium line-clamp-2 leading-tight">
                          {item.title || item.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => fetchContent(false)}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-white/40 text-sm">
              No results found. Try different filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
