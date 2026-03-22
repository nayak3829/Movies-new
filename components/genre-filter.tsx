'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Movie } from '@/lib/tmdb';
import { MovieRow } from './movie-row';

interface Genre {
  id: number;
  name: string;
}

interface InitialRow {
  title: string;
  movies: Movie[];
}

interface GenreFilterProps {
  genres: Genre[];
  initialRows: InitialRow[];
  type: 'movie' | 'tv';
}

export function GenreFilter({ genres, initialRows, type }: GenreFilterProps) {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  const scrollPills = (dir: 'left' | 'right') => {
    if (!pillsRef.current) return;
    pillsRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  const handleGenreSelect = async (genreId: number | null) => {
    setActiveGenre(genreId);
    if (genreId === null) {
      setFilteredMovies([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/genre?genreId=${genreId}&type=${type}`);
      const data = await res.json();
      setFilteredMovies(data.results || []);
    } catch {
      setFilteredMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeGenreName = genres.find(g => g.id === activeGenre)?.name;

  return (
    <div>
      <div className="relative px-4 md:px-12 mb-4 md:mb-6">
        <button
          onClick={() => scrollPills('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-muted transition-colors md:left-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={pillsRef}
          className="flex gap-2 overflow-x-auto py-1 mx-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => handleGenreSelect(null)}
            className={cn(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
              activeGenre === null
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
            )}
          >
            All
          </button>
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className={cn(
                'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                activeGenre === genre.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                  : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground'
              )}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollPills('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-muted transition-colors md:right-8"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {activeGenre !== null ? (
        <div className="min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredMovies.length > 0 ? (
            <MovieRow
              title={activeGenreName ?? 'Results'}
              movies={filteredMovies}
            />
          ) : (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              No results found for this genre.
            </div>
          )}
        </div>
      ) : (
        initialRows.map(row => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            mediaType={type}
          />
        ))
      )}
    </div>
  );
}
