# Sage V — Codebase Inventory

> Auto-generated during Phase 1 of the Sage V rebrand. Last updated: 2026-04-27.

---

## Backend API Endpoints

All routes are prefixed by the router prefix. Auth prefixes: `/auth`. Services prefix: `/services`.

### Auth — `auth_router` (`/`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/signin` | Sign in user, returns access + refresh tokens |
| POST | `/refresh` | Exchange refresh token for new access token |

### Auth — `user_router` (`/user`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/user` | Get user by email |
| POST | `/user` | Create new user |
| GET | `/user/list` | List all users (admin) |
| PATCH | `/user/modify` | Modify user |

### Auth — `api_key_router` (`/api-key`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api-key/list` | List all API keys for user |
| POST | `/api-key` | Create new API key |
| GET | `/api-key` | Get specific API key |
| PATCH | `/api-key/modify` | Modify API key |
| POST | `/api-key/ulca` | Create ULCA API key (hidden) |
| DELETE | `/api-key/ulca` | Delete ULCA API key (hidden) |
| PATCH | `/api-key/ulca` | Set ULCA API key tracking (hidden) |

### Services — `admin_router` (`/admin`) — ADMIN role required
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/dashboard` | View admin dashboard (paginated) |
| POST | `/admin/create/service` | Create a service |
| POST | `/admin/create/model` | Create a model |
| PATCH | `/admin/update/service` | Update a service |
| PATCH | `/admin/update/model` | Update a model |
| DELETE | `/admin/delete/service` | Delete a service |
| DELETE | `/admin/delete/model` | Delete a model |
| PATCH | `/admin/health` | Update service health status |

### Services — `details_router` (`/details`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/details/list_services` | List all services |
| POST | `/details/view_service` | View service details + feedback |
| GET | `/details/list_models` | List all models |
| POST | `/details/view_model` | View model details |

### Services — `feedback_router` (`/feedback`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/feedback/submit` | Submit inference feedback |
| GET | `/feedback/questions` | Get feedback questions for service |
| GET | `/feedback/export` | Export feedback as CSV (admin) |

### Services — `inference_router` (`/inference`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/inference/translation` | NMT — translate text |
| POST | `/inference/transliteration` | XLIT — transliterate text |
| POST | `/inference/asr` | ASR — speech to text |
| POST | `/inference/tts` | TTS — text to speech |
| POST | `/inference/vad` | VAD — voice activity detection |
| POST | `/inference/ner` | NER — named entity recognition |
| POST | `/inference/s2s` | S2S — speech to speech |
| POST | `/inference/pipeline` | Pipeline — chained inference |

### Root
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message |
| GET | `/healthz` | Health check (added Phase 6) |

### WebSocket Mounts
| Path | Description |
|------|-------------|
| `/socket.io` | Streaming inference (SeqStreamer) |
| `/socket_asr.io` | ASR-specific streaming (legacy) |

---

## Frontend Pages (`/client/pages`)

| Page | Path | Layout | Description |
|------|------|---------|-------------|
| Login | `/` | None | Login form |
| Home / Dashboard | `/home` | Dashboard | Overview dashboard |
| Services | `/services` | Dashboard | List all services |
| View Service | `/services/view` | Dashboard | Service details + TryOut |
| Models | `/models` | Dashboard | Model registry list |
| View Model | `/models/view` | Dashboard | Model details |
| Admin | `/admin` | Dashboard | Admin panel (API keys, export feedback) |
| Monitoring | `/monitoring` | Dashboard | Embedded Grafana |
| Pipeline | `/pipeline` | Dashboard | Pipeline builder |
| Analyze | `/analyze` | None | Analysis page |
| Billing | `/billing` | Dashboard | Billing info |
| Profile | `/profile` | Dashboard | User profile |
| 403 | `/403` | None | Unauthorized error page |
| 404 | `/404` | None | Not found page |

---

## Frontend Components (`/client/components`)

### Admin
| Component | File | Description |
|-----------|------|-------------|
| AdminPage | `Admin/AdminPage.tsx` | Admin panel wrapper with section navigation |
| AccessKeys | `Admin/AccessKeys.tsx` | API key CRUD table |
| KeyModal | `Admin/KeyModal.tsx` | Create/edit API key modal |
| ExportFeedback | `Admin/ExportFeedback.tsx` | Feedback export with date filter |

### Navigation
| Component | File | Description |
|-----------|------|-------------|
| Sidebar | `Navigation/Sidebar.tsx` | Collapsible icon sidebar |
| Navbar | `Navigation/Navbar.tsx` | Top bar with title + user menu |
| NavbarMobile | `Navigation/NavbarMobile.tsx` | Mobile top navigation |
| SidebarMobile | `Navigation/SidebarMobile.tsx` | Mobile slide-out navigation |

### Services
| Component | File | Description |
|-----------|------|-------------|
| ServicesTable | `Services/ServicesTable.tsx` | Table of all services |
| ViewServiceTabs | `Services/ViewServiceTabs.tsx` | Service detail tabs |
| ServicePerformanceModal | `Services/ServicePerformanceModal.tsx` | Latency/benchmark modal |
| Usage | `Services/Usage.tsx` | Service usage chart |

### Models
| Component | File | Description |
|-----------|------|-------------|
| ModelsTable | `Models/ModelsTable.tsx` | Table of all models |

### TryOut (Interactive Playgrounds)
| Component | File | Description |
|-----------|------|-------------|
| ASR | `TryOut/ASR.tsx` | Speech recognition playground |
| TTS | `TryOut/TTS.tsx` | Text-to-speech playground |
| NMT | `TryOut/NMT.tsx` | Translation playground |
| NER | `TryOut/NER.tsx` | Named entity recognition playground |
| XLIT | `TryOut/XLIT.tsx` | Transliteration playground |

### Layouts
| Component | File | Description |
|-----------|------|-------------|
| DashboardLayout | `Layouts/DashboardLayout.tsx` | Full dashboard wrapper |
| ContentLayout | `Layouts/ContentLayout.tsx` | Content area wrapper |

### Benchmarks
| Component | File | Description |
|-----------|------|-------------|
| ServiceBenchmark | `Benchmarks/ServiceBenchmark.tsx` | Service benchmark display |

### Feedback
| Component | File | Description |
|-----------|------|-------------|
| Feedback | `Feedback/Feedback.tsx` | Feedback form component |
| Rating | `Feedback/Rating.tsx` | Star rating widget |
| FeedbackTypes | `Feedback/FeedbackTypes.ts` | TypeScript types |

### Utilities
| Component | File | Description |
|-----------|------|-------------|
| NotFound | `Utils/NotFound.tsx` | 404 not-found widget |
| Options | `Utils/Options.js` | Dropdown option helpers |
| Documentation | `Documentation/Documentation.tsx` | Documentation panel |

### Mobile
| Component | File | Description |
|-----------|------|-------------|
| KeyCard | `Mobile/Admin/KeyCard.tsx` | Mobile API key card |
| ModelCard | `Mobile/Models/ModelCard.tsx` | Mobile model card |
| ModelsList | `Mobile/Models/ModelsList.tsx` | Mobile models list |
| ServiceCard | `Mobile/Services/ServiceCard.tsx` | Mobile service card |
| ServicesList | `Mobile/Services/ServicesList.tsx` | Mobile services list |

---

## Docker Services

### `docker-compose-app.yml`
| Service | Container Name | Image | Ports | Description |
|---------|---------------|-------|-------|-------------|
| server | server | server | `$BACKEND_PORT` | FastAPI backend |
| client | client | client | `$FRONTEND_PORT` | Next.js frontend |
| seed | seed | seed | — | DB seed runner |
| appdb-migration | appdb-migration | server | — | DB migration runner |

### `docker-compose-db.yml`
| Service | Container | Description |
|---------|-----------|-------------|
| app_db | app_db | MongoDB for application data |
| log_db | log_db | MongoDB for logs |
| redis | redis | Redis cache |
| timescaledb | timescaledb | TimescaleDB for metering |

### `docker-compose-monitoring.yml`
| Service | Container | Description |
|---------|-----------|-------------|
| prometheus | prometheus | Prometheus metrics scraper |
| grafana | grafana | Grafana dashboards |
| prom-aggregation-gateway | prom-aggregation-gateway | Prometheus push gateway |

### `docker-compose-metering.yml`
| Service | Container | Description |
|---------|-----------|-------------|
| rabbitmq | rabbitmq | RabbitMQ message broker for Celery |
| celery | celery | Celery async task worker |
| celery-flower | celery-flower | Celery Flower monitoring UI |

---

## Grafana Dashboards (`/grafana/provisioning/dashboards`)

| File | Description |
|------|-------------|
| `dhruva_general_requests.json` | General API request metrics |
| `dhruva_global.json` | Global platform overview |
| `dhruva_inference_requests.json` | Inference-specific metrics |
| `docker_containers.json` | Docker container metrics |
| `docker_host.json` | Host system metrics |
| `monitor_services.json` | Service health monitoring |
| `traefik_rev5.json` | Traefik reverse proxy metrics |

---

## Kubernetes Manifests (`/deployment/k8s`)

| File | Description |
|------|-------------|
| `server/server-configmap.yaml` | Server ConfigMap |
| `server/server-deployment.yaml` | Server Deployment |
| `server/server-service.yaml` | Server Service |
