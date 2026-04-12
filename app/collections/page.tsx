import type { Metadata } from 'next';

export const revalidate = 86400;

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { getCollection, getImageUrl } from '@/lib/tmdb';

export const metadata: Metadata = {
  title: 'Collections - TechVyro',
  description: 'Browse popular movie franchises and collections.',
};

const POPULAR_COLLECTIONS = [
  { id: 10, name: 'Star Wars', emoji: '⚔️' },
  { id: 645, name: 'James Bond', emoji: '🔫' },
  { id: 1241, name: 'Harry Potter', emoji: '🧙' },
  { id: 119, name: 'Lord of the Rings', emoji: '💍' },
  { id: 9485, name: 'Fast & Furious', emoji: '🚗' },
  { id: 86311, name: 'The Avengers', emoji: '🦸' },
  { id: 295, name: 'Pirates of the Caribbean', emoji: '🏴‍☠️' },
  { id: 84, name: 'Indiana Jones', emoji: '🎩' },
  { id: 87359, name: 'Mission: Impossible', emoji: '💣' },
  { id: 404609, name: 'John Wick', emoji: '🐶' },
  { id: 328, name: 'Jurassic Park', emoji: '🦕' },
  { id: 2344, name: 'The Matrix', emoji: '💊' },
  { id: 263, name: 'The Dark Knight', emoji: '🦇' },
  { id: 131635, name: 'The Hunger Games', emoji: '🏹' },
  { id: 748, name: 'X-Men', emoji: '🧬' },
  { id: 8650, name: 'Transformers', emoji: '🤖' },
];

async function fetchCollection(id: number, name: string) {
  try {
    return await getCollection(id);
  } catch {
    return { id, name, overview: '', poster_path: null, backdrop_path: null, parts: [] };
  }
}

export default async function CollectionsPage() {
  const collections = await Promise.all(
    POPULAR_COLLECTIONS.map(({ id, name }) => fetchCollection(id, name))
  );

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />

      <div className="pt-20 sm:pt-24 pb-24 md:pb-8">
        <div className="container mx-auto px-4 mb-8">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.05em' }}
          >
            Franchises & Collections
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Explore your favourite movie universes
          </p>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {collections.map((col, i) => {
              const emoji = POPULAR_COLLECTIONS[i].emoji;
              return (
                <Link key={col.id} href={`/collection/${col.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted border border-white/10 group-hover:border-white/30 transition-all shadow-lg">
                    {col.poster_path ? (
                      <img
                        src={getImageUrl(col.poster_path, 'w342')}
                        alt={col.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 gap-2">
                        <span className="text-4xl">{emoji}</span>
                        <span className="text-white/60 text-sm text-center px-2">{col.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{col.name}</p>
                      {col.parts.length > 0 && (
                        <p className="text-white/60 text-xs mt-0.5">{col.parts.length} films</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      
    </main>
  );
}
