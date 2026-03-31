import { MovieRow } from './movie-row';
import { ComingSoon } from './coming-soon';
import {
  getPopularMovies,
  getNowPlayingMovies,
  getPopularTVShows,
  getMoviesByGenre,
  getUpcomingMovies,
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

export async function HomeFeedRows() {
  const [
    popular,
    nowPlaying,
    popularTV,
    actionMovies,
    comedyMovies,
    horrorMovies,
    upcoming,
  ] = await Promise.all([
    fetchWithFallback(() => getPopularMovies(), emptyResponse),
    fetchWithFallback(() => getNowPlayingMovies(), emptyResponse),
    fetchWithFallback(() => getPopularTVShows(), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(28), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(35), emptyResponse),
    fetchWithFallback(() => getMoviesByGenre(27), emptyResponse),
    fetchWithFallback(() => getUpcomingMovies(), emptyResponse),
  ]);

  return (
    <>
      <MovieRow title="Popular Movies" movies={popular.results} />
      <MovieRow title="Now Playing" movies={nowPlaying.results} />
      <MovieRow title="Action Movies" movies={actionMovies.results} />
      <MovieRow title="Comedy" movies={comedyMovies.results} />
      <MovieRow title="Horror" movies={horrorMovies.results} />
      <MovieRow title="Popular TV Shows" movies={popularTV.results} />
      <ComingSoon movies={upcoming.results} title="Coming Soon" />
    </>
  );
}
