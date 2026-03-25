'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { User, Clock, Bookmark, Star, Film, Tv, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { WatchHistoryItem } from '@/components/continue-watching';

interface SavedItem { id: number; media_type: 'movie' | 'tv'; }
interface Rating { id: number; rating: number; }

export default function ProfilePage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [myList, setMyList] = useState<SavedItem[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      setHistory(JSON.parse(localStorage.getItem('watchHistory') || '[]'));
      setMyList(JSON.parse(localStorage.getItem('myList') || '[]'));
      const stored = JSON.parse(localStorage.getItem('userRatings') || '{}');
      setRatings(Object.entries(stored).map(([k, v]) => ({ id: Number(k), rating: v as number })));
    } catch {}
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('watchHistory');
    setHistory([]);
  };

  const moviesWatched = history.filter(h => h.media_type === 'movie').length;
  const showsWatched = history.filter(h => h.media_type === 'tv').length;
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(1) : '—';

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-24 md:pb-12 container mx-auto px-4 max-w-3xl">
        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-red-700 flex items-center justify-center shadow-xl shadow-primary/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Guest User</h1>
            <p className="text-muted-foreground text-sm">Free Plan · TechVyro</p>
          </div>
        </div>

        {/* Stats Grid */}
        {isMounted && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Film, label: 'Movies Watched', value: moviesWatched, color: 'text-blue-400' },
              { icon: Tv, label: 'Shows Watched', value: showsWatched, color: 'text-purple-400' },
              { icon: Bookmark, label: 'In My List', value: myList.length, color: 'text-green-400' },
              { icon: Star, label: 'Avg Rating', value: avgRating, color: 'text-yellow-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <span className={`text-2xl font-bold ${color}`}>{value}</span>
                <span className="text-xs text-muted-foreground mt-1">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="space-y-3 mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Quick Access
          </h2>
          {[
            { href: '/history', icon: Clock, label: 'Watch History', desc: `${history.length} titles watched` },
            { href: '/my-list', icon: Bookmark, label: 'My List', desc: `${myList.length} titles saved` },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link key={href} href={href} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{isMounted ? desc : '...'}</p>
              </div>
              <span className="text-white/30 text-xs">›</span>
            </Link>
          ))}
        </div>

        {/* Danger Zone */}
        {isMounted && history.length > 0 && (
          <div className="border border-destructive/30 rounded-xl p-5 bg-destructive/5">
            <h3 className="font-semibold text-destructive mb-1 text-sm">Danger Zone</h3>
            <p className="text-xs text-muted-foreground mb-4">These actions cannot be undone.</p>
            <Button variant="destructive" size="sm" onClick={clearHistory} className="gap-2 text-xs">
              <Trash2 className="w-3.5 h-3.5" />
              Clear Watch History
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
