<a name="readme-top"></a>

<div align="center">

# Sage V

### *Wisdom in every voice.*

**An open-source AI inference platform for Indian language models**
ASR · TTS · NMT · NER · Transliteration · Pipeline · Streaming

[![Next.js][Nextjs]][Next-url]
[![Chakra UI][Chakra-ui]][Chakra-url]
[![FastAPI][FastApi]][FastApi-url]
[![Python][Python]][Python-url]
[![MongoDB][MongoDB]][MongoDB-url]
[![Docker][Docker]][Docker-url]

</div>

---

## About

**Sage V** is a full-stack inference platform that lets you host, manage, and query AI models for Indian languages at scale. Built on the [Dhruva Platform](https://github.com/AI4Bharat/Dhruva-Platform) by AI4Bharat, Sage V adds a modernized UI, new dashboard, improved security, and developer-friendly tooling.

### Capabilities

| Service Type | Description |
|---|---|
| **ASR** | Automatic Speech Recognition |
| **TTS** | Text-to-Speech synthesis |
| **NMT** | Neural Machine Translation |
| **NER** | Named Entity Recognition |
| **XLIT** | Transliteration |
| **S2S** | Speech-to-Speech |
| **Pipeline** | Chained multi-model inference |
| **Streaming** | Real-time ASR via WebSocket |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 13, React 18, Chakra UI 2, TypeScript |
| Backend | Python 3.10+, FastAPI, Pydantic v1 |
| Database | MongoDB (app + logs), TimescaleDB (metering) |
| Cache | Redis |
| Queue | RabbitMQ + Celery |
| Monitoring | Prometheus + Grafana |
| Inference | Triton Inference Server |

---

## Getting Started

### Prerequisites

- Docker + Docker Compose
- Copy `.env.example` → `.env` and fill in your values

```bash
cp .env.example .env
```

### Quick Start

```bash
# 1. Build images
docker build -f server/Dockerfile -t sage-v-server server/
docker build -f client/Dockerfile -t sage-v-client client/

# 2. Start databases + monitoring
docker compose -f docker-compose-db.yml up -d
docker compose -f docker-compose-metering.yml up -d
docker compose -f docker-compose-monitoring.yml up -d

# 3. Start the application
docker compose -f docker-compose-app.yml up -d
```

The frontend will be available at `http://localhost:$FRONTEND_PORT`  
The API will be available at `http://localhost:$BACKEND_PORT`  
API docs: `http://localhost:$BACKEND_PORT/docs`  
Health check: `http://localhost:$BACKEND_PORT/healthz`

### Local Development (frontend)

```bash
cd client
yarn install
yarn dev
```

### Local Development (backend)

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 5050
```

---

## Project Structure

```
sage-v/
├── client/          # Next.js frontend (pages, components, themes)
├── server/          # FastAPI backend (auth, services, inference)
├── grafana/         # Grafana provisioning (dashboards, datasources)
├── prometheus/      # Prometheus config
├── deployment/k8s/  # Kubernetes manifests
├── docker-compose-app.yml
├── docker-compose-db.yml
├── docker-compose-metering.yml
├── docker-compose-monitoring.yml
├── Makefile
└── .env.example
```

---

## Make Commands

```bash
make build        # Build frontend
make lint         # Lint (server + client)
make typecheck    # TypeScript + mypy
make test         # Run all tests
make format       # Auto-format code
```

---

## Migrations

Database migrations live in `server/migrations/`. To create a new one:

```bash
mongodb-migrate-create --description <description>
```

Run migrations by starting with `docker-compose-app.yml` — the `appdb-migration` service runs them automatically.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

---

## Upstream Attribution

Sage V is derived from the [Dhruva Platform](https://github.com/AI4Bharat/Dhruva-Platform) by [AI4Bharat](https://ai4bharat.org), released under the MIT License. See [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE).

---

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- BADGES -->
[Nextjs]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Chakra-ui]: https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakraui&logoColor=white
[Chakra-url]: https://chakra-ui.com/
[FastApi]: https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white
[FastApi-url]: https://fastapi.tiangolo.com/
[Python]: https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://python.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://mongodb.com/
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://docker.com/
[Celery]: https://img.shields.io/static/v1?style=for-the-badge&message=Celery&color=37814A&logo=Celery&logoColor=FFFFFF&label=
[Celery-url]: https://docs.celeryq.dev/
