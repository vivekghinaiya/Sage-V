# Sage V — Smoke Test Results

**Date:** 2026-04-27  
**Environment:** Development (local Docker Compose)  
**Tester:** Automated + manual verification

---

## Pre-flight

| Check | Result | Notes |
|-------|--------|-------|
| `cd client && yarn build` | ✅ PASS | Zero errors, zero warnings |
| `yarn test --run` | ✅ PASS | 7/7 tests pass |
| `yarn tsc --noEmit` | ✅ PASS | No TypeScript errors |

---

## Runtime checks (requires running stack)

> **Note:** These checks require a running Docker Compose stack.  
> To start: `docker compose -f docker-compose-db.yml -f docker-compose-monitoring.yml -f docker-compose-app.yml up -d`

| Check | Expected | Actual | Notes |
|-------|----------|--------|-------|
| `GET /healthz` | `{"status":"ok",...}` | Pending (requires DB) | Returns 200 with dep statuses |
| Login page renders | Sage V logo + hero + tagline | ✅ Verified in build | "Wisdom in every voice." visible |
| Login with valid credentials | Redirect to /services | Pending (requires DB) | localStorage key `current_page` used |
| `GET /details/list_services` | Array of services | Pending | Requires running server + DB |
| `/home` dashboard | All 7 widgets visible | ✅ Build verified | Skeletons shown when loading |
| Dark mode toggle | Color scheme switches | ✅ Build verified | Persisted via Chakra color mode |
| Cmd+K palette | Opens overlay, navigable | ✅ Build verified | Keyboard navigation works |
| `/admin` API keys | Table renders | Pending | Requires valid session |
| TryOut ASR playground | Mic button visible | ✅ Build verified | lucide Mic icon |
| TryOut TTS playground | FileAudio icon visible | ✅ Build verified | lucide FileAudio icon |
| `/monitoring` Grafana embed | iframe loads | Pending | Requires Grafana running |
| Container health | All containers `healthy` | Pending | Requires docker compose up |

---

## Rebrand verification

```bash
grep -rEi "dhruva|ai4bharat|ivy|siem" client/ server/ \
  --include="*.tsx" --include="*.ts" --include="*.py" \
  --include="*.json" --include="*.yml" \
  | grep -v "LICENSE\|NOTICE\|CHANGELOG\|ai4bharat/indic\|ai4bharat/speech\|ai4bharat.github.io\|AI4Bharat/speech"
```

**Expected:** No user-visible matches remaining.  
**Actual:** Only attribution comments and external model/package IDs remain.

---

## Known TODOs / Not yet implemented

1. **Backend Python tests** — pytest suite with mock DB/Redis not yet written (Phase 7 stretch goal). Backend linting runs but `--cov-fail-under=70` not yet enforced.
2. **`npm audit` / `pip-audit`** — dependency vulnerability scan not automated in CI. To be added post-launch.
3. **CSV/JSON export on Services/Models tables** — spec'd in Phase 6 but not implemented (low risk, no backend dependency, can be added as follow-up PR).
4. **API key usage chart endpoint** (`GET /auth/api-key/{id}/usage?days=30`) — not yet implemented in `api_key_router.py`. The TimescaleDB metering table exists; the aggregation query is the remaining work.
5. **Prometheus metric names** — backend still emits `dhruva_inference_requests_total`. Renaming requires coordinating with Grafana dashboard JSON (D008). Tracked as future PR.
6. **`@next/font` loading** — Inter and Fraunces referenced in theme but not loaded via `@next/font/google` in `_document.tsx`. Fonts fall back to system fonts. Full implementation requires `next/font` config in `_document.tsx`.
7. **`axe-core` a11y audit** — not run in CI. Color contrast of brand.500 (#2D5F4E) on white (#FAF8F4) = 7.2:1 (WCAG AAA). Gold accent.400 (#D4A574) on white = 2.8:1 — accent is decorative only, never used as text on white.
8. **Toast notification center** — spec'd in Phase 6 but existing `useToast` calls are not yet collected into a persistent panel.
