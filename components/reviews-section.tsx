'use client';

import { Star, MessageSquare } from 'lucide-react';
import { getImageUrl, type Review } from '@/lib/tmdb';

interface ReviewsSectionProps {
  reviews: Review[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getAvatarUrl(avatarPath: string | null): string | null {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('/https://')) return avatarPath.slice(1);
  if (avatarPath.startsWith('http')) return avatarPath;
  return getImageUrl(avatarPath, 'w200');
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-6 md:py-10">
      <h2 className="text-lg md:text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Reviews
        <span className="text-white/40 text-sm font-normal">({reviews.length})</span>
      </h2>

      <div className="space-y-4">
        {reviews.slice(0, 5).map((review) => {
          const avatarUrl = getAvatarUrl(review.author_details.avatar_path);
          const rating = review.author_details.rating;
          const initials = (review.author_details.name || review.author || '?')[0].toUpperCase();

          return (
            <div
              key={review.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-3 md:gap-4 mb-3">
                {/* Avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/80 to-red-800 flex-shrink-0 border border-white/10">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={review.author}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-medium text-white text-sm truncate">
                      {review.author_details.name || review.author}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {rating !== null && (
                        <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-yellow-400 text-xs font-semibold">{rating}/10</span>
                        </div>
                      )}
                      <span className="text-white/30 text-xs">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                  {review.author_details.username && (
                    <p className="text-white/40 text-xs mt-0.5">@{review.author_details.username}</p>
                  )}
                </div>
              </div>

              <ReviewContent content={review.content} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ReviewContent({ content }: { content: string }) {
  const maxLen = 400;
  if (content.length <= maxLen) {
    return <p className="text-white/65 text-sm leading-relaxed">{content}</p>;
  }
  return (
    <details className="group">
      <summary className="cursor-pointer list-none">
        <p className="text-white/65 text-sm leading-relaxed">
          {content.slice(0, maxLen)}...{' '}
          <span className="text-primary text-xs group-open:hidden">Read more</span>
        </p>
        <p className="text-white/65 text-sm leading-relaxed hidden group-open:block">
          {content}
          <span className="text-primary text-xs ml-1">Show less</span>
        </p>
      </summary>
    </details>
  );
}
