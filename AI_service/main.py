import logging
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.errors import AIServiceError, ai_service_exception_handler, generic_exception_handler
from routes.question_routes import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.service_name)
###Risky Change in production - Chanchal
###### CORS Middleware - Allow all origins for simplicity (adjust in production) ######
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

app.add_exception_handler(AIServiceError, ai_service_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    request.state.request_id = request_id

    start = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = int((time.perf_counter() - start) * 1000)

    response.headers["x-request-id"] = request_id
    logger.info(
        "request path=%s method=%s status=%s latency_ms=%s request_id=%s",
        request.url.path,
        request.method,
        response.status_code,
        elapsed_ms,
        request_id,
    )
    return response

@app.get("/")
def home():
    return {"message": f"{settings.service_name} Running"}


@app.get("/health/live")
def health_live():
    return {"status": "ok"}


@app.get("/health/ready")
def health_ready():
    return {
        "status": "ready",
        "checks": {
            "groq_api_key_configured": bool(settings.groq_api_key),
            "service_api_key_configured": bool(settings.service_api_key),
        },
    }