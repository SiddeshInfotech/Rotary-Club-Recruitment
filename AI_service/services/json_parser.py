"""
JSON parsing and extraction utilities for LLM outputs.
"""
import json
import logging
import re

from core.errors import LLMOutputParseError

logger = logging.getLogger(__name__)


def strip_code_fence(value: str) -> str:
    """Remove markdown code fences from a string."""
    fence_pattern = r"^```(?:json)?\s*(.*?)\s*```$"
    match = re.match(fence_pattern, value, flags=re.DOTALL)
    return match.group(1) if match else value


def extract_json_candidates(content: str) -> list[str]:
    """
    Extract potential JSON strings from content using multiple strategies.

    Tries:
    1. Raw stripped content
    2. Content within markdown code fences
    3. Content within braces { ... }
    4. Content within brackets [ ... ]
    """
    candidates: list[str] = []

    # Strategy 1: Raw content
    stripped = content.strip()
    if stripped:
        candidates.append(stripped)

    # Strategy 2: Code fenced blocks
    fenced_blocks = re.findall(r"```(?:json)?\s*(.*?)\s*```", content, flags=re.DOTALL | re.IGNORECASE)
    for block in fenced_blocks:
        block_stripped = block.strip()
        if block_stripped:
            candidates.append(block_stripped)

    # Strategy 3: Objects {...}
    obj_start = content.find("{")
    obj_end = content.rfind("}")
    if obj_start != -1 and obj_end != -1 and obj_end > obj_start:
        candidates.append(content[obj_start : obj_end + 1].strip())

    # Strategy 4: Arrays [...]
    arr_start = content.find("[")
    arr_end = content.rfind("]")
    if arr_start != -1 and arr_end != -1 and arr_end > arr_start:
        candidates.append(content[arr_start : arr_end + 1].strip())

    # Remove duplicates while preserving order
    unique_candidates = list(dict.fromkeys(candidates))
    return unique_candidates


def parse_llm_json_or_raise(raw_content: str):
    """
    Parse JSON from LLM output, trying multiple strategies.

    Args:
        raw_content: Raw response from LLM (may contain fences, text, etc.)

    Returns:
        Parsed JSON object or array

    Raises:
        LLMOutputParseError: If JSON cannot be parsed from content
    """
    content = strip_code_fence(raw_content.strip())
    candidates = extract_json_candidates(content)

    last_error: json.JSONDecodeError | None = None
    for candidate in candidates:
        try:
            return json.loads(candidate)
        except json.JSONDecodeError as exc:
            last_error = exc

    logger.warning("llm_json_parse_failed raw_preview=%s", content[:400])
    raise LLMOutputParseError("LLM returned malformed JSON payload") from last_error
