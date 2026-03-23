'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, Film, Tv, Star } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  media_type: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
  overview: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const doSearch = useCallback(async (value: string) => {
    if (!value.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data.results?.filter((r: SearchResult) => r.media_type !== 'person') || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (q) { setQuery(q); doSearch(q); }
  }, [q, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      doSearch(query.trim());
    }
  };

  const filtered = filter === 'all' ? results : results.filter(r => r.media_type === filter);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}>
          Search
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search movies, TV shows..."
            autoFocus
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-base transition-all"
          />
          {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-primary" />}
        </form>

        {/* Type Filters */}
        {results.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            {(['all', 'movie', 'tv'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'bg-white/8 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
              >
                {f === 'all' ? `All (${results.length})` : f === 'movie' ? `Movies (${results.filter(r => r.media_type === 'movie').length})` : `TV Shows (${results.filter(r => r.media_type === 'tv').length})`}
              </button>
            ))}
          </div>
        )}

        {/* Empty / Initial state */}
        {!loading && !q && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-16 h-16 text-white/20 mb-4" />
            <p className="text-white/40 text-lg">Start typing to search for movies and TV shows</p>
          </div>
        )}

        {/* No results */}
        {!loading && q && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-white/40 text-xl mb-2">No results for &ldquo;{q}&rdquo;</p>
            <p className="text-white/25 text-sm">Try a different search term</p>
          </div>
        )}

        {/* Results Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(item => {
              const title = item.title || item.name || 'Unknown';
              const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0];
              return (
                <Link key={`${item.media_type}-${item.id}`} href={`/${item.media_type}/${item.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                    {item.poster_path ? (
                      <Image
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/20">
                        {item.media_type === 'tv' ? <Tv className="w-8 h-8" /> : <Film className="w-8 h-8" />}
                        <span className="text-xs px-2 text-center">{title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white/70 flex items-center gap-1">
                      {item.media_type === 'tv' ? <Tv className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {item.media_type === 'tv' ? 'TV' : 'Movie'}
                    </div>
                  </div>
                  <h3 className="font-medium text-sm truncate group-hover:text-white transition-colors">{title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {item.vote_average > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {item.vote_average.toFixed(1)}
                      </span>
                    )}
                    {year && <span>{year}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
