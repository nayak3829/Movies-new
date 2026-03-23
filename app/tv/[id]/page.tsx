import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { getTVDetails, getSimilarTV, getTVReviews, MovieResponse } from '@/lib/tmdb';
import { MovieRow } from '@/components/movie-row';
import { TVDetailClient } from '@/components/tv-detail-client';
import { ReviewsSection } from '@/components/reviews-section';
import { UserRating } from '@/components/user-rating';

interface TVPageProps {
  params: Promise<{ id: string }>;
}

const emptyResponse: MovieResponse = { page: 1, results: [], total_pages: 0, total_results: 0 };

export default async function TVPage({ params }: TVPageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  
  if (isNaN(tvId)) {
    notFound();
  }

  let show;
  try {
    show = await getTVDetails(tvId);
  } catch {
    notFound();
  }

  const [similar, reviews] = await Promise.allSettled([
    getSimilarTV(tvId),
    getTVReviews(tvId),
  ]);

  const similarShows = similar.status === 'fulfilled' ? similar.value : emptyResponse;
  const showReviews = reviews.status === 'fulfilled' ? reviews.value.results : [];

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />
      
      <TVDetailClient show={show} />

      <UserRating mediaId={show.id} mediaType="tv" title={show.name || show.title || ''} />

      <ReviewsSection reviews={showReviews} />

      {/* Similar Shows */}
      {similarShows.results.length > 0 && (
        <section className="py-8">
          <MovieRow title="More Like This" movies={similarShows.results} />
        </section>
      )}

      
    </main>
  );
}
