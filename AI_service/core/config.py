import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(PROJECT_ROOT / "backend" / ".env")


@dataclass(frozen=True)
class Settings:
    service_name: str = os.getenv("SERVICE_NAME", "AI Service")
    service_api_key: str = os.getenv("SERVICE_API_KEY", "")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    llm_model: str = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
    llm_timeout_seconds: int = int(os.getenv("LLM_TIMEOUT_SECONDS", "25"))
    llm_max_retries: int = int(os.getenv("LLM_MAX_RETRIES", "2"))
    llm_retry_backoff_seconds: float = float(os.getenv("LLM_RETRY_BACKOFF_SECONDS", "0.8"))
    use_sentence_transformer_embeddings: bool = os.getenv("USE_SENTENCE_TRANSFORMER_EMBEDDINGS", "false").lower() in {
        "1",
        "true",
        "yes",
    }


settings = Settings()
