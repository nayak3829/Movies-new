import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { getMovieDetails, getSimilarMovies, getMovieReviews, MovieResponse } from '@/lib/tmdb';
import { MovieRow } from '@/components/movie-row';
import { MovieDetailClient } from '@/components/movie-detail-client';
import { ReviewsSection } from '@/components/reviews-section';
import { UserRating } from '@/components/user-rating';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

const emptyResponse: MovieResponse = { page: 1, results: [], total_pages: 0, total_results: 0 };

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }

  let movie;
  try {
    movie = await getMovieDetails(movieId);
  } catch {
    notFound();
  }

  const [similar, reviews] = await Promise.allSettled([
    getSimilarMovies(movieId),
    getMovieReviews(movieId),
  ]);

  const similarMovies = similar.status === 'fulfilled' ? similar.value : emptyResponse;
  const movieReviews = reviews.status === 'fulfilled' ? reviews.value.results : [];

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />
      
      <MovieDetailClient movie={movie} />

      <UserRating mediaId={movie.id} mediaType="movie" title={movie.title} />

      <ReviewsSection reviews={movieReviews} />

      {/* Similar Movies */}
      {similarMovies.results.length > 0 && (
        <section className="py-8">
          <MovieRow title="More Like This" movies={similarMovies.results} />
        </section>
      )}

      
    </main>
  );
}
