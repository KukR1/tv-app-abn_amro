# TV Show Dashboard (ABN AMRO Assessment)

## Why this stack
- **Vue 3 + TypeScript**: aligns with ABN AMRO preference and improves maintainability through type safety.
- **Vite**: fast local development and production builds.
- **Vue Router**: supports dashboard and details route separation.
- **Vitest**: lightweight unit test runner integrated with Vite.

## Current architecture (Step 4)
- Routing is defined in [src/router/index.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/router/index.ts).
- TVMaze domain types are in [src/types/tvmaze.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/types/tvmaze.ts).
- API access layer is in [src/services/tvmazeApi.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/services/tvmazeApi.ts).
- Genre grouping and sorting logic is in [src/utils/groupShowsByGenre.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/utils/groupShowsByGenre.ts).
- Reusable show card UI component is in [src/components/ShowCard.vue](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/components/ShowCard.vue).
- Dashboard screen is in [src/views/DashboardView.vue](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/views/DashboardView.vue).
- Show details screen is in [src/views/ShowDetailView.vue](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/views/ShowDetailView.vue).
- Formatting helpers are in [src/utils/showFormatters.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/utils/showFormatters.ts).
- Dashboard search by show name uses the TVMaze search endpoint through [src/services/tvmazeApi.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/services/tvmazeApi.ts).
- Unit tests are in [src/services/tvmazeApi.test.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/services/tvmazeApi.test.ts), [src/utils/groupShowsByGenre.test.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/utils/groupShowsByGenre.test.ts), and [src/utils/showFormatters.test.ts](/Users/kukri/Desktop/Projects/tv-app-abn_amro/src/utils/showFormatters.test.ts).

## Environment
- **Node.js**: `v22.20.0`
- **npm**: `11.6.4`

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Unit tests
```bash
npm run test:unit
```
