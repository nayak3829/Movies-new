export interface StreamingServer {
  id: string;
  name: string;
  movie: string;
  tv: string;
  isCustom?: boolean;
  priority?: number;
}

// Default streaming servers - these will be used as fallback
export const DEFAULT_SERVERS: StreamingServer[] = [
  {
    id: 'vidsrc-to',
    name: 'Vidsrc',
    movie: 'https://vidsrc.to/embed/movie/{id}',
    tv: 'https://vidsrc.to/embed/tv/{id}/{season}/{episode}',
    priority: 1
  },
  {
    id: 'vidsrc-vip',
    name: 'Vidsrc VIP',
    movie: 'https://vidsrc.vip/embed/movie/{id}',
    tv: 'https://vidsrc.vip/embed/tv/{id}/{season}/{episode}',
    priority: 2
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed',
    movie: 'https://autoembed.pro/movie/{id}',
    tv: 'https://autoembed.pro/tv/{id}/{season}/{episode}',
    priority: 3
  },
  {
    id: 'embedsu',
    name: 'EmbedSU',
    movie: 'https://embed.su/embed/movie/{id}',
    tv: 'https://embed.su/embed/tv/{id}/{season}/{episode}',
    priority: 4
  },
  {
    id: 'videasy',
    name: 'Videasy',
    movie: 'https://player.videasy.net/movie/{id}',
    tv: 'https://player.videasy.net/tv/{id}/{season}/{episode}',
    priority: 5
  },
  {
    id: 'vidfast',
    name: 'VidFast',
    movie: 'https://vidfast.pro/movie/{id}',
    tv: 'https://vidfast.pro/tv/{id}/{season}/{episode}',
    priority: 6
  },
  {
    id: 'uembed',
    name: 'UEmbed',
    movie: 'https://uembed.site/embed/{id}',
    tv: 'https://uembed.site/embed/{id}/{season}/{episode}',
    priority: 7
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    movie: 'https://multiembed.mov/?video_id={id}&tmdb=1',
    tv: 'https://multiembed.mov/?video_id={id}&tmdb=1&s={season}&e={episode}',
    priority: 8
  },
  {
    id: 'moviesapi',
    name: 'MoviesAPI',
    movie: 'https://moviesapi.club/movie/{id}',
    tv: 'https://moviesapi.club/tv/{id}-{season}-{episode}',
    priority: 9
  },
  {
    id: '2embed',
    name: '2Embed',
    movie: 'https://www.2embed.cc/embed/{id}',
    tv: 'https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}',
    priority: 10
  }
];

// Generate embed URL for a server
export function getEmbedUrl(
  server: StreamingServer,
  tmdbId: number,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number
): string {
  const template = type === 'movie' ? server.movie : server.tv;
  return template
    .replace('{id}', String(tmdbId))
    .replace('{season}', String(season || 1))
    .replace('{episode}', String(episode || 1));
}

// Local storage keys
const SERVERS_STORAGE_KEY = 'streaming_servers';
const CUSTOM_SERVERS_KEY = 'custom_servers';
const SERVER_STATS_KEY = 'server_stats';

// Server statistics for smart sorting
export interface ServerStats {
  serverId: string;
  successCount: number;
  failCount: number;
  lastSuccess?: number;
  avgLoadTime?: number;
}

// Get servers from localStorage or return defaults
export function getStoredServers(): StreamingServer[] {
  if (typeof window === 'undefined') return DEFAULT_SERVERS;
  
  try {
    const stored = localStorage.getItem(SERVERS_STORAGE_KEY);
    if (stored) {
      const servers = JSON.parse(stored);
      return servers.length > 0 ? servers : DEFAULT_SERVERS;
    }
  } catch {
    // Ignore parsing errors
  }
  return DEFAULT_SERVERS;
}

// Get custom servers added by user
export function getCustomServers(): StreamingServer[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CUSTOM_SERVERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parsing errors
  }
  return [];
}

// Save servers to localStorage
export function saveServers(servers: StreamingServer[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SERVERS_STORAGE_KEY, JSON.stringify(servers));
}

// Add a custom server
export function addCustomServer(server: Omit<StreamingServer, 'id' | 'isCustom'>): StreamingServer {
  const customServers = getCustomServers();
  const newServer: StreamingServer = {
    ...server,
    id: `custom-${Date.now()}`,
    isCustom: true,
    priority: 0 // Custom servers get highest priority
  };
  customServers.push(newServer);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_SERVERS_KEY, JSON.stringify(customServers));
  }
  
  return newServer;
}

// Remove a custom server
export function removeCustomServer(serverId: string): void {
  if (typeof window === 'undefined') return;
  
  const customServers = getCustomServers().filter(s => s.id !== serverId);
  localStorage.setItem(CUSTOM_SERVERS_KEY, JSON.stringify(customServers));
}

// Get all servers (default + custom), sorted by priority and stats
export function getAllServers(): StreamingServer[] {
  const defaultServers = DEFAULT_SERVERS;
  const customServers = getCustomServers();
  const stats = getServerStats();
  
  const allServers = [...customServers, ...defaultServers];
  
  // Sort by success rate and priority
  return allServers.sort((a, b) => {
    const statsA = stats[a.id] || { successCount: 0, failCount: 0 };
    const statsB = stats[b.id] || { successCount: 0, failCount: 0 };
    
    const rateA = statsA.successCount / (statsA.successCount + statsA.failCount + 1);
    const rateB = statsB.successCount / (statsB.successCount + statsB.failCount + 1);
    
    // Prefer higher success rate
    if (Math.abs(rateA - rateB) > 0.1) {
      return rateB - rateA;
    }
    
    // Then by priority
    return (a.priority || 99) - (b.priority || 99);
  });
}

// Get server statistics
export function getServerStats(): Record<string, ServerStats> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(SERVER_STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parsing errors
  }
  return {};
}

// Update server statistics
export function updateServerStats(serverId: string, success: boolean, loadTime?: number): void {
  if (typeof window === 'undefined') return;
  
  const stats = getServerStats();
  const serverStats = stats[serverId] || { serverId, successCount: 0, failCount: 0 };
  
  if (success) {
    serverStats.successCount++;
    serverStats.lastSuccess = Date.now();
    if (loadTime) {
      serverStats.avgLoadTime = serverStats.avgLoadTime
        ? (serverStats.avgLoadTime + loadTime) / 2
        : loadTime;
    }
  } else {
    serverStats.failCount++;
  }
  
  stats[serverId] = serverStats;
  localStorage.setItem(SERVER_STATS_KEY, JSON.stringify(stats));
}

// Reset all server statistics
export function resetServerStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SERVER_STATS_KEY);
}
