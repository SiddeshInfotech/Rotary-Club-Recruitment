"""
LLM client and request handling for Groq API.
"""
import logging
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from functools import lru_cache

from groq import Groq

from core.config import settings
from core.errors import AIServiceError, LLMTimeoutError

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_groq_client() -> Groq:
    """Initialize and cache the Groq API client."""
    if not settings.groq_api_key:
        raise AIServiceError("GROQ_API_KEY is not configured", code="CONFIG_ERROR", status_code=500)
    return Groq(api_key=settings.groq_api_key)


def chat_completion_with_retry(prompt: str, json_mode: bool = False) -> str:
    """
    Execute a chat completion request with retry logic and timeout handling.

    Args:
        prompt: The prompt to send to the LLM
        json_mode: Whether to request JSON format output

    Returns:
        The LLM response content

    Raises:
        LLMTimeoutError: If request times out on all retries
        AIServiceError: If request fails on all retries
    """
    client = get_groq_client()
    max_attempts = settings.llm_max_retries + 1

    for attempt in range(1, max_attempts + 1):
        try:
            start = time.perf_counter()

            def _invoke():
                payload = {
                    "model": settings.llm_model,
                    "messages": [{"role": "user", "content": prompt}],
                }
                if json_mode:
                    payload["response_format"] = {"type": "json_object"}
                return client.chat.completions.create(**payload)

            with ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(_invoke)
                response = future.result(timeout=settings.llm_timeout_seconds)

            elapsed_ms = int((time.perf_counter() - start) * 1000)
            logger.info("llm_request_ok attempt=%s latency_ms=%s", attempt, elapsed_ms)
            return response.choices[0].message.content or ""
        except FuturesTimeoutError as exc:
            logger.warning("llm_request_timeout attempt=%s timeout_s=%s", attempt, settings.llm_timeout_seconds)
            if attempt >= max_attempts:
                raise LLMTimeoutError() from exc
        except Exception as exc:
            logger.warning("llm_request_failed attempt=%s error=%s", attempt, str(exc))
            if attempt >= max_attempts:
                raise AIServiceError("Failed to get completion from LLM", code="LLM_REQUEST_FAILED", status_code=502) from exc

        time.sleep(settings.llm_retry_backoff_seconds * attempt)

    raise AIServiceError("Failed to get completion from LLM", code="LLM_REQUEST_FAILED", status_code=502)
