import { Suspense } from 'react';

export const revalidate = 14400;

import { Navbar } from '@/components/navbar';
import { HeroBanner } from '@/components/hero-banner';
import { MovieRow } from '@/components/movie-row';
import { ContinueWatching } from '@/components/continue-watching';
import { BelowFoldRows } from '@/components/below-fold-rows';
import { HomeFeedRows } from '@/components/home-feed-rows';
import { ContentFilter } from '@/components/content-filter';
import { getTrending, MovieResponse } from '@/lib/tmdb';

const emptyResponse: MovieResponse = { page: 1, results: [], total_pages: 0, total_results: 0 };

async function fetchWithFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}

const RowSkeleton = () => (
  <div className="space-y-0 md:space-y-1">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-48 sm:h-56 md:h-64 animate-pulse bg-muted/10 rounded mx-4 md:mx-12 mb-2" />
    ))}
  </div>
);

export default async function HomePage() {
  const trending = await fetchWithFallback(() => getTrending('week'), emptyResponse);

  const hasApiKey = process.env.TMDB_API_KEY;
  const hasContent = trending.results.length > 0;

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />
      
      {!hasApiKey || !hasContent ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 max-w-lg">
            <h2 className="text-2xl font-bold text-white mb-4">TMDB API Key Required</h2>
            <p className="text-gray-400 mb-6">
              To display movies and TV shows, you need to add your TMDB API key.
            </p>
            <ol className="text-left text-gray-300 space-y-2 mb-6">
              <li>1. Go to <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">themoviedb.org/settings/api</a></li>
              <li>2. Create a free account and get your API key</li>
              <li>3. Click Settings (gear icon) in top right of v0</li>
              <li>4. Go to Vars section</li>
              <li>5. Add <code className="bg-gray-800 px-2 py-1 rounded">TMDB_API_KEY</code> with your key</li>
            </ol>
            <p className="text-gray-500 text-sm">After adding the key, refresh this page.</p>
          </div>
        </div>
      ) : (
        <>
          <HeroBanner movies={trending.results.slice(0, 5)} />
          
          <div className="-mt-16 sm:-mt-24 md:-mt-32 relative z-10 space-y-0 md:space-y-1 pb-24 md:pb-8">
            <ContinueWatching />
            <ContentFilter />

            {/* Trending row — data already available, renders instantly */}
            <MovieRow title="Trending Now" movies={trending.results} showRank />

            {/* Popular, Now Playing, Genres — streamed in after hero */}
            <Suspense fallback={<RowSkeleton />}>
              <HomeFeedRows />
            </Suspense>

            {/* Below-fold rows — streamed in last */}
            <Suspense fallback={<RowSkeleton />}>
              <BelowFoldRows />
            </Suspense>
          </div>
        </>
      )}
    </main>
  );
}
