from fastapi import Request
from fastapi.responses import JSONResponse


class AIServiceError(Exception):
    def __init__(self, message: str, code: str = "AI_SERVICE_ERROR", status_code: int = 500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)


class LLMTimeoutError(AIServiceError):
    def __init__(self, message: str = "LLM request timed out"):
        super().__init__(message=message, code="LLM_TIMEOUT", status_code=504)


class LLMOutputParseError(AIServiceError):
    def __init__(self, message: str = "LLM returned invalid JSON"):
        super().__init__(message=message, code="LLM_OUTPUT_PARSE_ERROR", status_code=502)


class EmbeddingGenerationError(AIServiceError):
    def __init__(self, message: str = "Failed to generate embedding"):
        super().__init__(message=message, code="EMBEDDING_ERROR", status_code=502)


def error_response(code: str, message: str, request_id: str | None = None, status_code: int = 500):
    payload = {
        "error": {
            "code": code,
            "message": message,
            "request_id": request_id,
        }
    }
    return JSONResponse(status_code=status_code, content=payload)


async def ai_service_exception_handler(request: Request, exc: AIServiceError):
    request_id = getattr(request.state, "request_id", None)
    return error_response(exc.code, exc.message, request_id=request_id, status_code=exc.status_code)


async def generic_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", None)
    return error_response("INTERNAL_SERVER_ERROR", "Unexpected server error", request_id=request_id, status_code=500)
