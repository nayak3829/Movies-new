import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { getCollection, getImageUrl } from '@/lib/tmdb';
import { MovieRow } from '@/components/movie-row';
import { Film } from 'lucide-react';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  const collectionId = parseInt(id, 10);

  if (isNaN(collectionId)) notFound();

  let collection;
  try {
    collection = await getCollection(collectionId);
  } catch {
    notFound();
  }

  const sortedParts = [...collection.parts].sort((a, b) => {
    const dateA = a.release_date || '';
    const dateB = b.release_date || '';
    return dateA.localeCompare(dateB);
  });

  return (
    <main className="min-h-screen bg-background pb-24 md:pb-8" suppressHydrationWarning>
      <Navbar />

      {/* Hero */}
      <div className="relative h-[40vh] md:h-[55vh]">
        {collection.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={getImageUrl(collection.backdrop_path, 'original')}
              alt={collection.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        )}
        <div className="relative h-full container mx-auto px-4 flex items-end pb-8 md:pb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-primary" />
              <span className="text-white/60 text-sm">{sortedParts.length} Films</span>
            </div>
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.03em' }}
            >
              {collection.name}
            </h1>
            {collection.overview && (
              <p className="text-white/60 text-sm md:text-base leading-relaxed line-clamp-3">
                {collection.overview}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Movies in collection */}
      <section className="py-8">
        <MovieRow
          title={`All ${collection.name} Films`}
          movies={sortedParts}
        />
      </section>

      
    </main>
  );
}
