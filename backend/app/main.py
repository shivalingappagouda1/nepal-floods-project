"""Main FastAPI application entrypoint for HIMALAYA-SHIELD."""

import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import logger
from app.core.errors import (
    DisasterIntelligenceException,
    http_exception_handler,
    validation_exception_handler,
    custom_disaster_exception_handler,
    general_exception_handler
)
from app.api.v1 import api_router
from app.api.v1.health import router as health_router


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=(
            "Advanced AI-Assisted Disaster Intelligence & Transboundary Emergency Response API. "
            "Exposes explainable geospatial risk, satellite change detection, damage assessment, "
            "and priority decision-support services with strict provenance tracking."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    # CORS Middleware configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception Handlers
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(DisasterIntelligenceException, custom_disaster_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)

    # Request Timing and Logging Middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = time.time()
        logger.info(f"--> {request.method} {request.url.path}")
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000.0
        logger.info(f"<-- {request.method} {request.url.path} - Status: {response.status_code} ({process_time:.2f}ms)")
        response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
        return response

    # Mount Routes
    # Root-level health endpoint (GET /health)
    app.include_router(health_router)
    
    # API endpoints under /api
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app


app = create_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
