# Hospital Management Frontend

A modern command-center style dashboard for hospital operations. The codebase mirrors the layered, onion-style structure from the previous CarParts WMS project ([mhkhizil/warehouse-management-fe](https://github.com/mhkhizil/warehouse-management-fe)), so anyone familiar with that repository can navigate this one immediately.

## Highlights
- React 19, TypeScript, Vite 7
- Tailwind CSS, Radix primitives, shadcn-inspired UI kit
- React Router v7 with nested layouts
- Layered domain/application/infrastructure/presentation stack under `src/core`
- Axios HTTP client with token-aware interceptors + fallback mock data for offline UX reviews

## Project Structure
```
src
├── components        # Layout, theme, dashboard and UI primitives
├── core              # Domain entities, DTOs, services, infra + presentation hooks
├── hooks             # Cross-cutting hooks (toast, etc.)
├── lib               # Router, navigation config, utilities
└── pages             # Route-level screens (Dashboard, Patients, etc.)
```
See `src/core/architecture.md` for a deep dive into how the layers map to the older warehouse project.

## Getting Started
```bash
npm install
npm run dev
```
Copy `.env.example` to `.env` and set the HIS base URL:
```
VITE_API_BASE_URL=https://your-his-host/api
```
If the API is unavailable, repositories automatically serve curated mock data so designers and PMs can still validate flows.

## Available Scripts
- `npm run dev` – Vite dev server with HMR
- `npm run build` – Type-check + production build
- `npm run preview` – Preview the production bundle locally
- `npm run lint` – ESLint with the TypeScript-aware config

## Adding New Hospital Modules
1. Define the entity & repository contract in `src/core/domain`.
2. Create DTOs/application services in `src/core/application`.
3. Implement repositories or adapters inside `src/core/infrastructure` and register them in `di/container.ts`.
4. Expose the service through a hook under `src/core/presentation/hooks`.
5. Consume the hook from your page or component inside `src/pages` or `src/components`.

This workflow keeps UI concerns decoupled from data-access and mirrors the GitHub reference architecture, making long-term maintenance and onboarding much easier.
