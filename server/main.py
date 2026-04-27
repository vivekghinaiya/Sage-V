import os
import time
import uuid
from logging.config import dictConfig

import pymongo
from cache.app_cache import get_cache_connection
from custom_metrics import (
    INFERENCE_REQUEST_COUNT,
    INFERENCE_REQUEST_DURATION_SECONDS,
    registry,
)
from db.database import db_client
from db.metering_database import Base, engine
from dotenv import load_dotenv
from exception.base_error import BaseError
from exception.client_error import ClientError
from exception.ulca_delete_api_key_client_error import ULCADeleteApiKeyClientError
from exception.ulca_delete_api_key_server_error import ULCADeleteApiKeyServerError
from exception.ulca_set_api_key_tracking_client_error import (
    ULCASetApiKeyTrackingClientError,
)
from exception.ulca_set_api_key_tracking_server_error import (
    ULCASetApiKeyTrackingServerError,
)
from fastapi import FastAPI, Request
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_sqlalchemy import DBSessionMiddleware
from log.logger import LogConfig
from middleware import PrometheusGlobalMetricsMiddleware
from module import AuthApiRouter, ServicesApiRouter
from seq_streamer import StreamingServerTaskSequence

dictConfig(LogConfig().dict())

load_dotenv()

_startup_time = time.time()

app = FastAPI(
    title="Sage V API",
    description="Backend API for communicating with the Sage V platform",
    version=os.environ.get("APP_VERSION", "1.0.0"),
)

streamer = StreamingServerTaskSequence(
    max_connections=int(os.environ.get("MAX_SOCKET_CONNECTIONS_PER_WORKER", -1))
)
app.mount("/socket.io", streamer.app)

from asr_streamer import StreamingServerASR

streamer_asr = StreamingServerASR()
app.mount("/socket_asr.io", streamer_asr.app)

app.include_router(ServicesApiRouter)
app.include_router(AuthApiRouter)

# CORS — restricted to explicit allowed origins (D006)
_raw_origins = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(
    PrometheusGlobalMetricsMiddleware,
    app_name="Sage V",
    registry=registry,
    custom_labels=["api_key_name", "user_id"],
    custom_metrics=[INFERENCE_REQUEST_COUNT, INFERENCE_REQUEST_DURATION_SECONDS],
)

app.add_middleware(DBSessionMiddleware, custom_engine=engine)


# Request ID middleware (D006 / Phase 6)
@app.middleware("http")
async def attach_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


@app.on_event("startup")
async def init_mongo_client() -> None:
    db_client["app"] = pymongo.MongoClient(os.environ["APP_DB_CONNECTION_STRING"])


@app.on_event("startup")
async def init_metering_db() -> None:
    Base.metadata.create_all(engine)


@app.on_event("startup")
async def maybe_flush_cache() -> None:
    if os.environ.get("FLUSH_CACHE_ON_STARTUP", "false").lower() == "true":
        cache = get_cache_connection()
        cache.flushall()
        logger.info("Redis cache flushed on startup (FLUSH_CACHE_ON_STARTUP=true)")


@app.exception_handler(ULCASetApiKeyTrackingClientError)
async def ulca_set_api_key_tracking_client_error_handler(
    request: Request, exc: ULCASetApiKeyTrackingClientError
) -> JSONResponse:
    return JSONResponse(
        status_code=exc.error_code,
        content={"status": "failure", "message": exc.message},
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )


@app.exception_handler(ULCASetApiKeyTrackingServerError)
async def ulca_set_api_key_tracking_server_error_handler(
    request: Request, exc: ULCASetApiKeyTrackingServerError
) -> JSONResponse:
    logger.error("[%s] %s", getattr(request.state, "request_id", ""), exc)
    return JSONResponse(
        status_code=500,
        content={"status": "failure", "message": exc.error_kind + " - Internal Server Error"},
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )


@app.exception_handler(ULCADeleteApiKeyClientError)
async def ulca_delete_api_key_client_error_handler(
    request: Request, exc: ULCADeleteApiKeyClientError
) -> JSONResponse:
    return JSONResponse(
        status_code=exc.error_code,
        content={"isRevoked": False, "message": exc.message},
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )


@app.exception_handler(ULCADeleteApiKeyServerError)
async def ulca_delete_api_key_server_error_handler(
    request: Request, exc: ULCADeleteApiKeyServerError
) -> JSONResponse:
    logger.error("[%s] %s", getattr(request.state, "request_id", ""), exc)
    return JSONResponse(
        status_code=500,
        content={"isRevoked": False, "message": exc.error_kind + " - Internal Server Error"},
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )


@app.exception_handler(ClientError)
async def client_error_handler(request: Request, exc: ClientError) -> JSONResponse:
    if exc.log_exception:
        logger.error("[%s] %s", getattr(request.state, "request_id", ""), exc)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": {"message": exc.message}},
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )


@app.exception_handler(BaseError)
async def base_error_handler(request: Request, exc: BaseError) -> JSONResponse:
    logger.error("[%s] %s", getattr(request.state, "request_id", ""), exc)
    return JSONResponse(
        status_code=500,
        content={"detail": {"kind": exc.error_kind, "message": "Request failed. Please try again."}},
        headers={"X-Request-ID": getattr(request.state, "request_id", "")},
    )


@app.get("/")
def read_root() -> str:
    return "Welcome to Sage V API!"


@app.get("/healthz", tags=["Health"])
def health_check() -> dict:
    """Return platform health status with dependency checks."""
    import socket

    checks: dict = {}

    # MongoDB
    try:
        client = db_client.get("app")
        if client:
            client.admin.command("ping", serverSelectionTimeoutMS=1000)
            checks["mongo"] = "ok"
        else:
            checks["mongo"] = "not_initialized"
    except Exception as exc:
        logger.warning("Health check: mongo failed — %s", exc)
        checks["mongo"] = "degraded"

    # Redis
    try:
        cache = get_cache_connection()
        cache.ping()
        checks["redis"] = "ok"
    except Exception as exc:
        logger.warning("Health check: redis failed — %s", exc)
        checks["redis"] = "degraded"

    # TimescaleDB
    try:
        from db.metering_database import engine as metering_engine
        with metering_engine.connect() as conn:
            conn.execute("SELECT 1")
        checks["timescale"] = "ok"
    except Exception as exc:
        logger.warning("Health check: timescale failed — %s", exc)
        checks["timescale"] = "degraded"

    overall = (
        "ok"
        if all(v == "ok" for v in checks.values())
        else "degraded"
    )

    version_path = os.path.join(os.path.dirname(__file__), "..", "VERSION")
    try:
        with open(version_path) as fh:
            version = fh.read().strip()
    except OSError:
        version = os.environ.get("APP_VERSION", "unknown")

    return {
        "status": overall,
        "uptime_seconds": round(time.time() - _startup_time, 1),
        "version": version,
        **checks,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=5050, log_level="info", workers=2)
