'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Star, Clock, Calendar, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl, type Episode } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { getWatchProgress } from '@/components/watch-progress';

interface Season {
  season_number: number;
  episode_count: number;
  name: string;
}

interface EpisodeGuideProps {
  tvId: number;
  seasons: Season[];
  onPlayEpisode?: (season: number, episode: number) => void;
}

export function EpisodeGuide({ tvId, seasons, onPlayEpisode }: EpisodeGuideProps) {
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const [selectedSeason, setSelectedSeason] = useState(validSeasons[0]?.season_number ?? 1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<Episode | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    setLoading(true);
    setNowPlaying(null);
    fetch(`/api/season?tvId=${tvId}&season=${selectedSeason}`)
      .then((r) => r.json())
      .then((data) => {
        const eps: Episode[] = data.episodes || [];
        setEpisodes(eps);
        const map: Record<string, number> = {};
        eps.forEach((ep) => {
          const p = getWatchProgress(tvId, 'tv', ep.season_number, ep.episode_number);
          if (p && p.progress > 5) {
            map[`${ep.season_number}-${ep.episode_number}`] = p.progress;
          }
        });
        setProgressMap(map);
      })
      .catch(() => setEpisodes([]))
      .finally(() => setLoading(false));
  }, [tvId, selectedSeason]);

  const currentSeason = validSeasons.find((s) => s.season_number === selectedSeason);

  const handleEpisodeClick = (ep: Episode) => {
    setNowPlaying(ep);
    onPlayEpisode?.(ep.season_number, ep.episode_number);
  };

  const nowPlayingIndex = nowPlaying ? episodes.findIndex(e => e.id === nowPlaying.id) : -1;

  const goToPrev = () => {
    if (nowPlayingIndex > 0) setNowPlaying(episodes[nowPlayingIndex - 1]);
  };
  const goToNext = () => {
    if (nowPlayingIndex < episodes.length - 1) setNowPlaying(episodes[nowPlayingIndex + 1]);
  };

  return (
    <section className="container mx-auto px-4 py-6 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-2xl font-semibold">Episodes</h2>

        {validSeasons.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {currentSeason?.name || `Season ${selectedSeason}`}
              <ChevronDown className={cn('w-4 h-4 transition-transform', dropdownOpen && 'rotate-180')} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-background/98 backdrop-blur-xl border border-border rounded-lg shadow-2xl z-10 overflow-hidden">
                {validSeasons.map((season) => (
                  <button
                    key={season.season_number}
                    onClick={() => { setSelectedSeason(season.season_number); setDropdownOpen(false); }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm transition-colors',
                      season.season_number === selectedSeason
                        ? 'bg-primary/20 text-primary font-medium'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {season.name || `Season ${season.season_number}`}
                    <span className="text-white/40 text-xs ml-1">({season.episode_count} eps)</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Now Playing Panel */}
      {nowPlaying && (
        <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="relative aspect-video w-full bg-black">
            {nowPlaying.still_path ? (
              <Image
                src={getImageUrl(nowPlaying.still_path, 'original')}
                alt={nowPlaying.name}
                fill
                className="object-cover opacity-70"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/50">
                <Play className="w-16 h-16 text-white/20" />
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

            {/* Close Button */}
            <button
              onClick={() => setNowPlaying(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Episode Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">
                  Now Playing
                </span>
                <span className="text-white/30 text-xs">S{nowPlaying.season_number} E{nowPlaying.episode_number}</span>
              </div>
              <h3 className="text-white font-bold text-lg md:text-2xl leading-tight mb-2">
                {nowPlaying.name}
              </h3>
              <div className="flex items-center gap-4 text-white/50 text-xs mb-3">
                {nowPlaying.air_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(nowPlaying.air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {nowPlaying.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {nowPlaying.runtime}m
                  </span>
                )}
                {nowPlaying.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {nowPlaying.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              {nowPlaying.overview && (
                <p className="text-white/60 text-xs md:text-sm line-clamp-2 max-w-2xl">
                  {nowPlaying.overview}
                </p>
              )}
            </div>

            {/* Prev / Next nav */}
            <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 flex justify-between px-3 pointer-events-none">
              {nowPlayingIndex > 0 && (
                <button
                  onClick={goToPrev}
                  className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <span className="flex-1" />
              {nowPlayingIndex < episodes.length - 1 && (
                <button
                  onClick={goToNext}
                  className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-36 h-20 rounded-lg bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <p className="text-white/40 text-sm text-center py-8">No episode data available.</p>
      ) : (
        <div className="space-y-2">
          {episodes.map((ep) => {
            const isActive = nowPlaying?.id === ep.id;
            return (
              <div
                key={ep.id}
                className={cn(
                  'flex gap-3 md:gap-4 group p-2 rounded-xl transition-colors cursor-pointer',
                  isActive ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5'
                )}
                onClick={() => handleEpisodeClick(ep)}
              >
                {/* Thumbnail */}
                <div className="relative w-36 md:w-48 h-20 md:h-27 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-white/10 group-hover:border-white/30 transition-all">
                  {ep.still_path ? (
                    <Image
                      src={getImageUrl(ep.still_path, 'w300')}
                      alt={ep.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Play className="w-6 h-6 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition-all">
                      <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    E{ep.episode_number}
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
                  )}
                  {/* Episode watch progress bar */}
                  {progressMap[`${ep.season_number}-${ep.episode_number}`] && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-red-600"
                        style={{ width: `${progressMap[`${ep.season_number}-${ep.episode_number}`]}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      'text-sm md:text-base font-medium transition-colors line-clamp-1',
                      isActive ? 'text-primary' : 'text-white group-hover:text-primary'
                    )}>
                      {ep.episode_number}. {ep.name}
                    </h3>
                    {ep.vote_average > 0 && (
                      <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                        <Star className="w-3 h-3 fill-yellow-500" />
                        <span className="text-xs font-medium">{ep.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-white/40 text-xs">
                    {ep.air_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ep.air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    {ep.runtime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ep.runtime}m
                      </span>
                    )}
                  </div>

                  {ep.overview && (
                    <p className="text-xs md:text-sm text-white/50 mt-1.5 line-clamp-2 leading-relaxed">
                      {ep.overview}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
