import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { getPersonDetails, getImageUrl } from '@/lib/tmdb';
import { Calendar, MapPin, Star, Clapperboard, Tv } from 'lucide-react';

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateAge(birthday: string | null, deathday: string | null) {
  if (!birthday) return null;
  const end = deathday ? new Date(deathday) : new Date();
  const birth = new Date(birthday);
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  return age;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const personId = parseInt(id, 10);

  if (isNaN(personId)) notFound();

  let person;
  try {
    person = await getPersonDetails(personId);
  } catch {
    notFound();
  }

  const age = calculateAge(person.birthday, person.deathday);

  const movieCredits = (person.movie_credits?.cast || [])
    .filter((m) => m.poster_path && m.title)
    .sort((a, b) => {
      const dateA = a.release_date || '';
      const dateB = b.release_date || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 24);

  const tvCredits = (person.tv_credits?.cast || [])
    .filter((t) => t.poster_path && (t.name || t.title))
    .sort((a, b) => {
      const dateA = a.first_air_date || '';
      const dateB = b.first_air_date || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 24);

  return (
    <main className="min-h-screen bg-background pb-24 md:pb-8" suppressHydrationWarning>
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mx-auto md:mx-0">
              {person.profile_path ? (
                <img
                  src={getImageUrl(person.profile_path, 'w500')}
                  alt={person.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-6xl font-bold text-muted-foreground">
                  {person.name[0]}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h1
              className="text-3xl md:text-5xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '0.03em' }}
            >
              {person.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm text-white/60">
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-medium">
                {person.known_for_department}
              </span>
              {person.birthday && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(person.birthday)}
                  {age !== null && !person.deathday && (
                    <span className="text-white/40">({age} years old)</span>
                  )}
                  {age !== null && person.deathday && (
                    <span className="text-white/40">(died age {age})</span>
                  )}
                </span>
              )}
              {person.deathday && (
                <span className="flex items-center gap-1.5 text-red-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Died {formatDate(person.deathday)}
                </span>
              )}
              {person.place_of_birth && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {person.place_of_birth}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>Popularity {person.popularity.toFixed(0)}</span>
              </span>
            </div>

            {person.biography && (
              <div>
                <h2 className="text-base font-semibold mb-2 text-white/80">Biography</h2>
                <p className="text-sm md:text-base text-white/60 leading-relaxed line-clamp-6">
                  {person.biography}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Movie Credits */}
        {movieCredits.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-red-500" />
              Movies
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {movieCredits.map((movie) => (
                <Link
                  key={`movie-${movie.id}`}
                  href={`/movie/${movie.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted border border-white/10 group-hover:border-white/30 transition-all shadow-md">
                    <img
                      src={getImageUrl(movie.poster_path, 'w185')}
                      alt={movie.title || ''}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-medium line-clamp-2 leading-tight">{movie.title}</p>
                      {movie.release_date && (
                        <p className="text-white/60 text-[9px]">{movie.release_date.split('-')[0]}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] md:text-xs text-white/60 truncate group-hover:text-white/80 transition-colors">{movie.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TV Credits */}
        {tvCredits.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-2">
              <Tv className="w-5 h-5 text-blue-400" />
              TV Shows
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {tvCredits.map((show) => (
                <Link
                  key={`tv-${show.id}`}
                  href={`/tv/${show.id}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted border border-white/10 group-hover:border-white/30 transition-all shadow-md">
                    <img
                      src={getImageUrl(show.poster_path, 'w185')}
                      alt={show.name || show.title || ''}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-medium line-clamp-2 leading-tight">{show.name || show.title}</p>
                      {show.first_air_date && (
                        <p className="text-white/60 text-[9px]">{show.first_air_date.split('-')[0]}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] md:text-xs text-white/60 truncate group-hover:text-white/80 transition-colors">{show.name || show.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      
    </main>
  );
}
