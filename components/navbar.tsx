'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Server,
  Zap,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchModal } from './search-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getAllServers, getServerStats, type ServerStats } from '@/lib/streaming-servers';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isServersDialogOpen, setIsServersDialogOpen] = useState(false);
  const [serversList, setServersList] = useState<ReturnType<typeof getServersListData>>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Get servers sorted by reliability for the dialog
  const getServersListData = () => {
    const servers = getAllServers();
    const stats = getServerStats();
    
    return servers.map(server => {
      const serverStats = stats[server.id];
      const total = serverStats ? serverStats.successCount + serverStats.failCount : 0;
      const successRate = total > 0 ? serverStats!.successCount / total : null;
      
      return {
        ...server,
        stats: serverStats,
        successRate,
        total
      };
    });
  };

  // Auto-fetch servers data when dialog is open
  useEffect(() => {
    if (!isServersDialogOpen) return;

    // Initial fetch
    setServersList(getServersListData());
    setLastUpdated(new Date());

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      setServersList(getServersListData());
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isServersDialogOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv-shows', label: 'TV Shows' },
    { href: '/new-popular', label: 'New & Popular' },
    { href: '/my-list', label: 'My List' },
  ];

  const notifications = [
    { id: 1, title: 'New Arrival', message: 'Check out the latest movies added this week', time: '2h ago' },
    { id: 2, title: 'Continue Watching', message: 'Resume where you left off', time: '1d ago' },
    { id: 3, title: 'Recommended for You', message: 'Based on your watch history', time: '3d ago' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled 
            ? 'bg-background/98 backdrop-blur-xl shadow-lg shadow-black/20' 
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">
            {/* Logo */}
            <div className="flex items-center gap-8 lg:gap-12">
              <Link href="/" className="flex items-center gap-2 group">
                <span 
                  className="text-2xl md:text-3xl font-bold tracking-wider transition-transform duration-300 group-hover:scale-105" 
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  <span className="text-foreground">TECH</span>
                  <span className="text-primary drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">VYRO</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md',
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  'p-2.5 rounded-full transition-all duration-300',
                  'hover:bg-white/10 hover:scale-110 active:scale-95',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50'
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="hidden md:block relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={cn(
                    'relative p-2.5 rounded-full transition-all duration-300',
                    'hover:bg-white/10 hover:scale-110 active:scale-95',
                    isNotificationOpen && 'bg-white/10'
                  )}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-background/98 backdrop-blur-xl border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className="p-4 border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <p className="text-sm font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-muted/30">
                      <button className="w-full text-center text-sm text-primary hover:underline">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="hidden md:block relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    'flex items-center gap-2 p-1 pr-2 rounded-md transition-all duration-300',
                    'hover:bg-white/10',
                    isProfileOpen && 'bg-white/10'
                  )}
                >
                  <div className="w-8 h-8 rounded overflow-hidden bg-gradient-to-br from-primary to-red-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown className={cn(
                    'w-4 h-4 transition-transform duration-300',
                    isProfileOpen && 'rotate-180'
                  )} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-background/98 backdrop-blur-xl border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-red-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Guest User</p>
                          <p className="text-xs text-gray-400">Free Plan</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                        <User className="w-4 h-4" />
                        Manage Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </button>
                      <button 
                        onClick={() => {
                          setIsServersDialogOpen(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Server className="w-4 h-4" />
                        Servers (Reliability)
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                      </button>
                    </div>
                    <div className="border-t border-border py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-primary hover:bg-white/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'md:hidden p-2.5 rounded-full transition-all duration-300',
                  'hover:bg-white/10 active:scale-95',
                  isMobileMenuOpen && 'bg-white/10'
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-out',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="bg-background/98 backdrop-blur-xl border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block py-3 px-4 rounded-lg text-base font-medium transition-all duration-200',
                      isActive 
                        ? 'text-white bg-primary/20 border-l-4 border-primary' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Mobile Profile Section */}
              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-red-700 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Guest User</p>
                    <p className="text-xs text-gray-400">Free Plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Servers Sorted by Reliability Dialog */}
      <Dialog open={isServersDialogOpen} onOpenChange={setIsServersDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Servers - Sorted by Reliability
            </DialogTitle>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Auto-updating every 5s
              </p>
            )}
          </DialogHeader>
          
          <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2">
            {serversList.map((server, index) => {
              const hasStats = server.total > 0;
              const isGood = server.successRate !== null && server.successRate > 0.7;
              const isMedium = server.successRate !== null && server.successRate > 0.4 && server.successRate <= 0.7;
              const isPoor = server.successRate !== null && server.successRate <= 0.4;
              
              return (
                <div 
                  key={server.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-muted-foreground w-5 text-center">
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {server.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {server.url}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {hasStats ? (
                      <>
                        <span className={cn(
                          "text-xs font-medium",
                          isGood && "text-green-500",
                          isMedium && "text-yellow-500",
                          isPoor && "text-red-500"
                        )}>
                          {Math.round((server.successRate ?? 0) * 100)}%
                        </span>
                        {isGood && <Zap className="w-4 h-4 text-green-500" />}
                        {isMedium && <BarChart3 className="w-4 h-4 text-yellow-500" />}
                        {isPoor && <BarChart3 className="w-4 h-4 text-red-500" />}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">No data</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Servers are automatically sorted by success rate, recent usage, and load time.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
