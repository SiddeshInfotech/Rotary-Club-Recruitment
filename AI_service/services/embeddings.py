"""
Embedding generation using deterministic hash or transformer models.
"""
import hashlib
import logging
from functools import lru_cache

from core.config import settings
from core.errors import EmbeddingGenerationError

logger = logging.getLogger(__name__)


def hash_embedding(text: str, dimensions: int = 64) -> list[float]:
    """
    Generate a deterministic lightweight embedding using SHA256 hash.

    This provides a fast fallback that doesn't require model artifacts.

    Args:
        text: Text to embed
        dimensions: Output vector dimensions (normalized from hash digest)

    Returns:
        List of floats in range [-1, 1]
    """
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    values: list[float] = []
    for i in range(dimensions):
        byte_value = digest[i % len(digest)]
        values.append((byte_value / 255.0) * 2 - 1)
    return values


@lru_cache(maxsize=1)
def get_embedding_model():
    """
    Lazily initialize and cache the sentence-transformer embedding model.

    Raises:
        EmbeddingGenerationError: If model initialization fails
    """
    try:
        from sentence_transformers import SentenceTransformer

        return SentenceTransformer("all-MiniLM-L6-v2")
    except Exception as exc:
        raise EmbeddingGenerationError(f"Failed to initialize embedding model: {exc}") from exc


def generate_embedding(text: str) -> list[float]:
    """
    Generate an embedding for the given text.

    Uses sentence-transformer if enabled (set USE_SENTENCE_TRANSFORMER_EMBEDDINGS=true),
    otherwise falls back to deterministic hash-based embedding.

    Args:
        text: Text to embed

    Returns:
        List of floats representing the embedding
    """
    if not settings.use_sentence_transformer_embeddings:
        return hash_embedding(text)

    try:
        model = get_embedding_model()
        return model.encode([text])[0].tolist()
    except Exception as exc:
        logger.warning("embedding_model_failed_fallback error=%s", str(exc))
        return hash_embedding(text)
