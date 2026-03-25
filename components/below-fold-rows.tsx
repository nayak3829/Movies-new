import { MovieRow } from './movie-row';
import { RecommendedRow } from './recommended-row';
import {
  getTopRatedMovies,
  getUpcomingMovies,
  getTopRatedTVShows,
  getMoviesByGenre,
  getTVShowsByGenre,
  MovieResponse,
} from '@/lib/tmdb';

const emptyResponse: MovieResponse = { page: 1, results: [], total_pages: 0, total_results: 0 };

async function fetchWithFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}

export async function BelowFoldRows() {
  const [
    topRated,
    upcoming,
    topRatedTV,
    sciFiMovies,
    romanceMovies,
    thrillerMovies,
    animationMovies,
    documentaries,
    crimeTV,
    dramaTV,
  ] = await Promise.all([
    fetchWithFallback(() => getTopRatedMovies(), emptyResponse),
    fetchWithFallback(() => getUpcomingMovies(), emptyResponse),
    fetchWithFallback(() => getTopRatedTVShows(), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(878), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(10749), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(53), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(16), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(99), emptyResponse),
    fetchWithFallback(() => getTVShowsByGenre(80), emptyResponse),
    fetchWithFallback(() => getTVShowsByGenre(18), emptyResponse),
  ]);

  return (
    <>
      <MovieRow title="Sci-Fi" movies={sciFiMovies.results} />
      <MovieRow title="Thriller" movies={thrillerMovies.results} />
      <MovieRow title="Top Rated Movies" movies={topRated.results} />
      <MovieRow title="Romance" movies={romanceMovies.results} />
      <MovieRow title="Crime TV" movies={crimeTV.results} />
      <MovieRow title="Animation" movies={animationMovies.results} />
      <MovieRow title="Drama TV" movies={dramaTV.results} />
      <MovieRow title="Coming Soon" movies={upcoming.results} />
      <MovieRow title="Top Rated TV Shows" movies={topRatedTV.results} />
      <MovieRow title="Documentaries" movies={documentaries.results} />
      <RecommendedRow />
    </>
  );
}
