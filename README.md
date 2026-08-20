# TV Show Dashboard

A clean, responsive Vue 3 TV show dashboard built with the TVMaze API. Browse shows by genre, sort by rating, search for your favorites, and view detailed info on each show.

**Live demo**: https://kukr1.github.io/tv-app-abn_amro/ (GitHub Pages)

## Features

- 📺 Browse shows grouped by genre with horizontal carousels
- ⭐ Shows sorted by rating (highest first)
- 🔍 Search shows by name with debounce
- 📱 Fully responsive design (mobile + desktop)
- 🎨 Tailwind CSS styling (no UI framework bloat)
- ✅ 59 unit tests across all layers
- 🚀 Auto-deployed via GitHub Actions

## Tech Stack

**Why Vite?**

- Fast HMR during development, lightning-quick builds
- Plays nicely with Tailwind

**Why Tailwind only?**

- No extra dependencies or component libraries
- Full control over styling
- Responsive utilities make mobile-first easy

**Testing:**

- Vitest for unit tests
- Tests cover API layer, data transformations, and state management
- All composables and pure functions tested

## Project structure

```
src/
├── api/              # Pure data functions (TVMaze API calls + data transformations)
├── services/         # Low-level API wrappers
├── composables/      # Vue state holders (no side effects)
├── views/            # Page components (DashboardView, ShowDetailView)
├── components/       # Reusable UI (ShowCard, ShowCarouselRow, etc)
├── utils/            # Pure helpers (grouping, formatting)
├── types/            # TypeScript interfaces
└── __tests__/        # Unit tests mirror src structure
```

## Setup & Run

**Requirements:** Node.js 20+

```bash
# Install dependencies
npm install

# Dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run tests
npm run test:unit
```

## Deployment

Deployed to GitHub Pages via GitHub Actions. Push to `main` branch and it auto-deploys.

**Manual deployment:**

```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

## Node & npm versions

- Node.js: v22.20.0
- npm: 11.6.4
