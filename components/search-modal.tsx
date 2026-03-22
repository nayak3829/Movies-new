'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Avengers', 'Breaking Bad', 'Stranger Things', 'The Batman',
  'Oppenheimer', 'Game of Thrones', 'Inception', 'The Bear',
];

const RECENT_KEY = 'recentSearches';

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const existing = getRecentSearches();
    const updated = [query, ...existing.filter(q => q !== query)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
    }
  }, [isOpen]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results?.filter((item: Movie) => item.poster_path).slice(0, 12) || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, handleSearch]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleChipClick = (term: string) => {
    setQuery(term);
  };

  const handleResultClick = () => {
    if (query.trim()) saveRecentSearch(query.trim());
    onClose();
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md">
      <div className="container mx-auto px-4 pt-4 sm:pt-8 md:pt-16">
        {/* Search Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies, TV shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  saveRecentSearch(query.trim());
                }
              }}
              className="w-full pl-10 sm:pl-12 pr-4 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg bg-secondary/80 border-border/50 focus-visible:ring-primary rounded-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2.5 sm:p-3 hover:bg-secondary rounded-full transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[75vh] sm:max-h-[70vh] overflow-y-auto pb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {results.map((item) => {
                const title = item.title || item.name || 'Unknown';
                const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                return (
                  <Link
                    key={item.id}
                    href={`/${mediaType}/${item.id}`}
                    onClick={handleResultClick}
                    className="group"
                  >
                    <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-1.5 sm:mb-2 bg-muted">
                      <Image
                        src={getImageUrl(item.poster_path, 'w300')}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-medium truncate">{title}</h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">{mediaType}</p>
                  </Link>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-muted-foreground">No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleChipClick(term)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm',
                          'bg-secondary hover:bg-secondary/80 border border-border/50 transition-colors'
                        )}
                      >
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleChipClick(term)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm',
                        'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors'
                      )}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
