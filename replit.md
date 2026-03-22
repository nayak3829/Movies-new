# TechVyro — Netflix-Style Streaming Website

## Project Overview
A Netflix-style movie and TV show streaming website built with **Next.js 16 App Router**, **React 19**, **Tailwind CSS v4**, and the **TMDB API**. Supports movies, TV shows, search, watchlist, genre filtering, and embedded video playback via multiple streaming servers.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Data**: TMDB API (server-side, `TMDB_API_KEY` env secret)
- **Package Manager**: pnpm
- **Port**: 5000 (dev: `next dev -p 5000 -H 0.0.0.0`)

## Architecture
- `app/` — Next.js App Router pages (server components)
- `app/api/` — API routes (search, genre discovery)
- `components/` — Client components
- `lib/tmdb.ts` — TMDB API helpers (server-side only)
- `lib/streaming-servers.ts` — Video embed URL helpers

## Key Features
- **Hero Banner** — Auto-slides with animated progress bar per indicator dot
- **Genre Filter** — Scrollable genre pills on Movies & TV Shows pages with live filtering via TMDB Discover API
- **Continue Watching** — localStorage-based watch history shown as a top row on home page; saved when Play is clicked on detail pages
- **Search Modal** — With recent searches (localStorage) and popular search chips
- **Watchlist (My List)** — Add/remove via localStorage `myList` key
- **Video Player** — Embedded iframe player with multiple streaming server fallback
- **WhatsApp Popup** — sessionStorage-gated, shows once per session after 4s delay

## localStorage Keys
- `myList` — watchlist items
- `watchHistory` — continue watching items (max 20)
- `recentSearches` — last 8 search queries
- `streaming_server_stats` — per-server reliability stats
- `custom_streaming_servers` — user-added servers

## API Routes
- `GET /api/search?query=` — TMDB multi-search
- `GET /api/genre?genreId=&type=movie|tv` — TMDB genre/discover

## Environment Secrets
- `TMDB_API_KEY` — Required, from themoviedb.org

## Pages
- `/` — Home with hero, continue watching, genre rows
- `/movies` — Movies with genre filter pills
- `/tv-shows` — TV Shows with genre filter pills
- `/movie/[id]` — Movie detail + video player
- `/tv/[id]` — TV show detail + video player
- `/my-list` — Saved watchlist
- `/new-popular` — New & popular content
