# Sage V Changelog

All notable changes vs. the upstream Dhruva Platform (AI4Bharat) are documented here.

---

## [1.0.0] — 2026-04-27 — Initial Sage V Release

### Phase 1 — Baseline inventory

- Added `INVENTORY.md` mapping all API endpoints, frontend pages, components, and Docker services.
- Rewrote `.env.example` with complete, documented environment variable reference.
- Added `NOTICE` file crediting AI4Bharat/Dhruva as upstream source.
- Added `DECISIONS.md` for architecture decisions log.
- Added `VERSION` file (`1.0.0`).

### Phase 2 — Global rebrand

- **Text replacements (case-aware):**
  - `Dhruva` → `Sage V`, `dhruva` → `sage-v`, `DHRUVA` → `SAGE_V` throughout all Python, TypeScript, YAML, and config files.
  - `AI4Bharat` → `Sage V` in user-visible strings (unchanged in LICENSE, NOTICE, attribution comments, and ML model IDs such as `ai4bharat/indic-conformer-*`).
- **Docker Compose:** all `container_name` values updated to `sage-v-*`; `dhruva-network` → `sage-v-network`.
- **FastAPI:** title/description updated to Sage V.
- **Frontend:** `<title>` tags, page headings, toast messages updated.
- **New SVG assets:**
  - `sage-v-logo.svg` — "Sage" wordmark + gold stylized V (soundwave).
  - `sage-v-mark.svg` — gold V mark on dark green circle (favicon/small display).
  - `sage-v-hero.svg` — abstract voice/language illustration in brand palette.
- **`client/package.json`** name updated to `sage-v-client`.
- **Grafana** dashboard titles updated; `GF_AUTH_ANONYMOUS_ORG_NAME=SageV`.
- **Kubernetes manifests** updated.

### Phase 3 — Bug fixes

- **localStorage key (`current_page`):** the original code checked `"currentpage"` (no underscore) but read/wrote `"current_page"`. Standardized on `current_page` — fixes the redirect-after-login feature that was always broken.
- **CORS wildcard removed:** `allow_origins=["*"]` replaced with `CORS_ALLOWED_ORIGINS` env var (comma-separated list). Default: `["http://localhost:3000"]`. Methods restricted to `GET, POST, PATCH, DELETE, OPTIONS`.
- **Redis cache flush gated:** `cache.flushall()` on startup now only runs when `FLUSH_CACHE_ON_STARTUP=true` (default false).
- **AdminPage numeric flags:** replaced `render == 0/1/2` state with typed `'menu' | 'access-keys' | 'feedback'` string union.
- **Removed all commented-out dead code** from `index.tsx` and `Sidebar.tsx`.
- **Fixed invalid JS identifiers:** sed-based rebrand incorrectly produced `sage-vAPI` (not a valid JS identifier). Fixed to `sageVAPI` / `sageVRootURL` / `sageVConfig` throughout.
- **`apiConfig.ts`:** full TypeScript rewrite with proper types, no `any`, SSR-safe localStorage access.

### Phase 4 — Design system

- **New Chakra theme (`themes/sage-v.ts`):**
  - `brand.*` color scale (deep sage green #2D5F4E).
  - `accent.*` color scale (warm gold #D4A574).
  - Semantic tokens: `bg.canvas`, `bg.surface`, `bg.muted`, `fg.default`, `fg.muted`, `border.default` in light/dark.
  - Status colors: success, warning, error, info.
  - Typography: Inter (body), Fraunces (headings), JetBrains Mono (code).
  - Radius scale: 6/10/14/20/28px. Brand-tinted shadows.
  - Component overrides: Button, Input, Select, Modal, Card, Table, Badge, Divider.
  - Dark mode support via `useSystemColorMode`.
- **Sidebar redesigned:** collapsible (hover to expand), brand colors, section headers (Workspace / Insights / Admin), active-state indicator (accent.400 left border + brand.50 bg), uses `sage-v-mark.svg` logo, icons from `lucide-react`.
- **Navbar redesigned:** sticky, dark mode toggle, global search stub (opens Cmd+K), user menu with avatar, Fraunces page title.
- **Login page redesigned:** two-column layout with `sage-v-hero.svg` on left, `sage-v-logo.svg` + "Wisdom in every voice." tagline + form on right. Brand-green submit button.
- **Replaced `react-icons` with `lucide-react`** across all 14 affected files.

### Phase 5 — New `/home` dashboard

- Replaced 3-line stub `<h1>Dhruva Home</h1>` with full dashboard page.
- **KPI strip (4 cards):** API calls (24h), active services, total models, API keys — with loading skeletons and empty states.
- **Task distribution bar chart** (recharts) — services grouped by task type with brand color ramp.
- **Latency panel** (recharts) — p50/p95/p99 illustrative bar chart.
- **Service health grid** — every service with colored status dot, click-through to service view.
- **Quick actions** — Try a model, Create API key, View docs, Open Grafana.
- **Grafana iframe embed** — pulls from `NEXT_PUBLIC_GRAFANA_URL`.
- All sections have loading skeletons and warm empty-state copy.
- Page header with Fraunces font: "Welcome back, {firstName}."

### Phase 6 — New features

- **`/healthz` endpoint** — `GET /healthz` returns `{status, mongo, redis, timescale, uptime_seconds, version}`. Each dep check has a 1s timeout; degraded deps don't fail the overall response.
- **Request ID middleware** — UUID generated per request, attached as `X-Request-ID` header on both request state and response. All error handlers surface the request ID in logs.
- **Dark mode toggle** — in navbar, persisted via Chakra color mode + localStorage. System preference respected on first load.
- **Command palette (Cmd+K)** — navigate all pages, search services/models, toggle theme. Keyboard navigation (↑↓↵Esc). Accessible (`role="dialog"`, `aria-modal`).
- **CORS and cache-flush fixes** — see Phase 3.
- **`VERSION` file** — read by `/healthz` endpoint.

### Phase 7 — Code quality

- **`Makefile`** — `make lint`, `make format`, `make typecheck`, `make build`, `make test`.
- **CI workflow** (`.github/workflows/ci.yml`) — lint + typecheck + build + test on PR and push to main/master. Caches Yarn and pip.
- **ErrorBoundary component** — wraps layout pages with "Something went off-key" fallback and error ID.
- **Test suite** — 7 tests passing: ErrorBoundary (3), KpiCard (2), AdminPage (2).
- **`vitest.config.ts`** — configured with jsdom environment, coverage via v8.
- **`vitest.setup.ts`** — mocks router, localStorage, `window.matchMedia`.
- **`ServiceList` type** extended with `isActive` and `taskType` optional fields.

### Dependencies added

| Package | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | ^0.298.0 | Icon library (replaces react-icons) |
| `recharts` | ^2.10.3 | Charts for dashboard |
| `cmdk` | ^0.2.0 | Command palette primitives |
| `vitest` | ^1.0.4 | Frontend test runner |
| `@vitejs/plugin-react` | ^4.2.1 | Vitest React plugin |
| `@testing-library/react` | ^14.1.2 | Component testing |
| `@testing-library/jest-dom` | ^6.1.5 | DOM matchers |
| `jsdom` | ^23.0.1 | Browser environment for tests |

### Dependencies removed

- `react-icons` — replaced by `lucide-react`

---

## Upstream Attribution

This project is derived from the [Dhruva Platform](https://github.com/AI4Bharat/Dhruva-Platform) by AI4Bharat, released under the MIT License. See `LICENSE` and `NOTICE` for full attribution.
