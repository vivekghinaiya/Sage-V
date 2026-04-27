# Sage V — Architecture Decisions

This file records non-obvious decisions made during the Dhruva → Sage V migration.

---

## D001 — Keep Pydantic v1, do not migrate to v2

**Decision:** Stay on `pydantic==1.10.13` (latest 1.x security patch).

**Reason:** The codebase uses Pydantic v1 validators, `orm_mode`, and `.dict()` idioms extensively throughout models, schemas, and repositories. A v2 migration would require rewriting dozens of files with a high risk of regression on the inference endpoints. Given the time budget, this risk is not acceptable.

**How to revisit:** After the rebrand ships, a dedicated Pydantic v2 migration PR can be done with full test coverage as a safety net.

---

## D002 — Keep pages router (Next.js 13.1), do not migrate to App Router

**Decision:** Stay on Next.js 13.1 with the pages router.

**Reason:** The codebase uses `getServerSideProps`/`getStaticProps` patterns in some pages and the `_app.tsx` / `_document.tsx` structure. Migrating to App Router is a significant refactor with no functional benefit for this sprint.

---

## D003 — Replace `react-icons` with `lucide-react`

**Decision:** Add `lucide-react` and migrate all icon usages; remove `react-icons` from `package.json`.

**Reason:** `lucide-react` is a single, consistently styled, tree-shakable icon set. The existing code uses icons from multiple `react-icons` sub-packages (io5, md, bi, ri, fa) resulting in inconsistent visual weight and larger bundles.

---

## D004 — Do not change external ML model IDs

**Decision:** Any string containing `ai4bharat/` followed by a model name (e.g., `ai4bharat/indic-conformer-600m`) is treated as an external resource identifier and is NOT rebranded.

**Reason:** These strings are Hugging Face model repository paths. Changing them would break all inference calls.

---

## D005 — `FLUSH_CACHE_ON_STARTUP` defaults to false

**Decision:** The original code called `cache.flushall()` unconditionally on startup. We gate this behind `FLUSH_CACHE_ON_STARTUP=true`.

**Reason:** Flushing Redis on every server restart wipes valid cached tokens and service state, causing unnecessary downstream errors in production. In dev, you can opt into the flush by setting the env var.

---

## D006 — CORS restricted to explicit origin list

**Decision:** Replace `allow_origins=["*"]` with a list read from `CORS_ALLOWED_ORIGINS` env var (comma-separated), defaulting to `["http://localhost:3000"]`.

**Reason:** Wildcard CORS with `allow_methods=["*"]` is a security vulnerability (CWE-942). The default is restrictive; production deployments must explicitly list their frontend origins.

---

## D007 — `current_page` localStorage key (consistent casing)

**Decision:** Standardize on `current_page` (with underscore) for the redirect-after-login localStorage key.

**Reason:** The original `pages/index.tsx` checked `localStorage.getItem("currentpage")` (no underscore) but read/wrote `current_page` (with underscore) elsewhere, so the redirect-to-last-page feature was always broken.

---

## D008 — Grafana dashboard JSON files keep "dhruva" in internal IDs

**Decision:** The JSON keys `uid`, `id`, and internal metric label strings within Grafana dashboard JSON files retain `dhruva` identifiers where they are Prometheus metric names.

**Reason:** Prometheus metric names (e.g., `dhruva_inference_requests_total`) are emitted by the running backend. Renaming them in dashboard JSON without also renaming the backend metric would break all charts. A coordinated rename is tracked as a future TODO.

---

## D009 — Admin panel navigation refactored to string union

**Decision:** Replace `render == 0/1/2` numeric state in `AdminPage.tsx` with `'menu' | 'access-keys' | 'feedback'` string union.

**Reason:** Magic numbers for UI state make the code unreadable and error-prone. Named string states are self-documenting and TypeScript can exhaustively check them.

---

## D010 — New `/healthz` endpoint uses 1-second dependency timeouts

**Decision:** Each dependency check (MongoDB, Redis, TimescaleDB) runs with a 1-second timeout. If a dependency fails its check, the endpoint still returns 200 but marks that dependency as `degraded`.

**Reason:** A hard failure of `/healthz` would prevent container orchestrators from routing traffic even if the application is partially functional. Returning degraded state allows operators to distinguish "totally down" from "running but a dep is slow."
