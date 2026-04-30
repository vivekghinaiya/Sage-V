# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

**Sage V** is a full-stack inference platform for serving Indian language AI models (ASR, TTS, NMT, NER, Transliteration, Pipeline, Streaming). The server exposes a ULCA-compatible API; the client is a Next.js dashboard with model tryout interfaces.

## Commands

### Client (`cd client` first)

```bash
yarn dev                        # Start dev server on port 3000
yarn build                      # Production build (must pass before merging)
yarn tsc --noEmit               # TypeScript check (no emit)
yarn lint                       # ESLint
yarn test --run                 # Vitest (all tests, no watch)
yarn test --run path/to/test    # Single test file
yarn test:coverage              # Coverage report (v8)
```

### Server (`cd server` first)

```bash
uvicorn main:app --reload --port 5050   # Dev server
ruff check .                            # Lint
ruff format .                           # Format
python -m mypy --ignore-missing-imports .   # Type check
python -m pytest . -v                   # All tests
python -m pytest path/to/test.py -v     # Single test
```

### Root (`make` targets)

```bash
make lint         # Ruff (server) + ESLint (client)
make format       # Ruff + Prettier
make typecheck    # mypy + tsc
make build        # Next.js build
make test         # All tests
```

### Docker

```bash
docker compose -f docker-compose-db.yml up -d           # MongoDB
docker compose -f docker-compose-metering.yml up -d     # RabbitMQ + Celery + Redis
docker compose -f docker-compose-monitoring.yml up -d   # Prometheus + Grafana
docker compose -f docker-compose-app.yml up -d          # App (server + client + migrations)
```

Copy `.env.example` → `.env` before starting any stack.

## Architecture

### Server (`server/`)

FastAPI app (`main.py`) with this layered structure under `module/`:

```
module/
  auth/           JWT + API key auth (router, service, repository, model)
  services/
    router/       4 routers: inference, admin, details, feedback
    service/      Business logic (inference_service.py is the largest at ~35KB)
    model/        Pydantic schemas
    repository/   MongoDB data access
    error/        Custom exceptions
db/               BaseRepository[T] generic for MongoDB; TimescaleDB via SQLAlchemy
cache/            Redis via CacheBaseModel with TTL
celery_backend/   Async task queue (logging, metrics push)
schema/           ULCA-style request/response schemas
middleware/       Prometheus metrics, request ID (X-Request-ID header)
```

**Request lifecycle:** Middleware (request ID → Prometheus → CORS) → Auth provider → Route handler → Custom logging route (`InferenceLoggingRoute`) → Celery task for async logging.

**Real-time:** SocketIO (`seq_streamer.py`) for task-sequence pipelines; WebSocket (`asr_streamer.py`) for live ASR. Both sit outside the main FastAPI router.

**Data stores:** MongoDB (app/user data via Motor async), TimescaleDB (usage metering via SQLAlchemy), Redis (cache-aside via `CacheBaseModel`).

### Client (`client/`)

Next.js 13 Pages Router with React Query for all server state.

```
pages/          Route pages — index (login), home (dashboard), pipeline, admin/, services/, models/
components/     Feature folders: Dashboard, Navigation, Models, Services, Admin, CommandPalette, TryOut, ErrorBoundary
api/            Axios layer: apiConfig.ts (interceptors + token refresh), serviceAPI, modelAPI, authAPI, adminAPI
types/          Global TypeScript declarations (auth.d.ts, services.d.ts, models.d.ts)
themes/         sage-v.ts — Chakra UI extended theme (brand/accent/semantic tokens, component overrides)
```

**Auth flow:** Login sets `access_token`, `refresh_token`, `user_id`, `user_role`, `email`, `current_page` in localStorage. `_app.tsx` guards all pages except the login index. The Axios response interceptor queues concurrent requests during token refresh to avoid race conditions.

**Layout:** `_app.tsx` conditionally wraps 19 authenticated pages with `<Layout>` (Navbar + Sidebar). Public page (`/`) renders bare.

**Theme:** `themes/sage-v.ts` exports `sageVTheme`. Brand color: `brand.*` (sage green #2D5F4E). Accent: `accent.*` (warm gold #D4A574). Semantic tokens wire light/dark mode. Import via `themes/index.js` as `customTheme`.

### Key identifiers (post-rebrand)

The codebase was rebranded from "Dhruva". Identifiers that look unusual are intentional:
- `sageVAPI` — axios URL map in `api/apiConfig.ts`
- `sageVConfig` — config object in `config/config.ts`
- `sageVRootURL` — base URL string

Do not rename these back to hyphenated forms (`sage-v*` is invalid in JS).

## Testing

Tests live in `client/__tests__/`. Vitest is configured with jsdom. Three mocks are set up globally in `vitest.setup.ts`: `next/router`, `window.matchMedia` (required by Chakra color mode), and `localStorage`. Any new test that renders a Chakra component needs the `ChakraProvider` wrapper.

No backend pytest suite exists yet — that is a known TODO.

## Environment Variables

Key variables to set for local dev (see `.env.example` for full list):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_BACKEND_API_URL` | Client → server URL |
| `NEXT_PUBLIC_GRAFANA_URL` | Grafana iframe in dashboard |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins (default: `http://localhost:3000`) |
| `FLUSH_CACHE_ON_STARTUP` | Set `true` to flush Redis on server start (default: false) |
| `JWT_SECRET_KEY` | JWT signing secret |
| `APP_DB_CONNECTION_STRING` | MongoDB connection string |
