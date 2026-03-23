"""
Competency assessment and score evaluation.
"""
import logging
import re

from core.errors import LLMOutputParseError
from services.json_parser import parse_llm_json_or_raise
from services.llm_client import chat_completion_with_retry

logger = logging.getLogger(__name__)

COMPETENCY_KEYS = [
    "Leadership",
    "Loyalty",
    "Adaptability",
    "Growth Mindset",
    "Reliability",
    "Teamwork",
    "Collaboration",
    "Problem Solving",
]


def evaluate_answers(candidate, answers: list[str]) -> dict[str, int]:
    """
    Evaluate candidate competencies based on their answers.

    Args:
        candidate: Candidate object with name, strengths, weaknesses, education, hobbies
        answers: List of text answers to evaluate

    Returns:
        Dictionary mapping competency names to scores (1-10)
    """
    prompt = f"""
You are a competency assessment expert.

Candidate Information:
Name: {candidate.name}
Education: {candidate.education}
Hobbies: {candidate.hobbies}
Strengths: {candidate.strengths}
Weaknesses: {candidate.weaknesses}

User Answers:
{chr(10).join(f"Q{i + 1}: {answer}" for i, answer in enumerate(answers))}

Based on these answers and candidate background, evaluate the candidate on a scale of 1-10 for these competencies:
Leadership, Loyalty, Adaptability, Growth Mindset, Reliability, Teamwork, Collaboration, Problem Solving.

Return ONLY valid JSON object:
{{
  "Leadership": score,
  "Loyalty": score,
  "Adaptability": score,
  "Growth Mindset": score,
  "Reliability": score,
  "Teamwork": score,
  "Collaboration": score,
  "Problem Solving": score
}}
"""
    raw_content = chat_completion_with_retry(prompt, json_mode=True)

    def _extract_scores_from_text(content: str) -> dict[str, int]:
        """Extract scores using regex fallback when JSON parsing fails."""
        extracted: dict[str, int] = {}
        for key in COMPETENCY_KEYS:
            escaped = re.escape(key)
            pattern = rf"{escaped}\s*[:=-]\s*([0-9]+(?:\.[0-9]+)?)"
            match = re.search(pattern, content, flags=re.IGNORECASE)
            if match:
                try:
                    extracted[key] = int(round(float(match.group(1))))
                except ValueError:
                    continue
        return extracted

    parsed: dict[str, object]
    try:
        maybe_parsed = parse_llm_json_or_raise(raw_content)
        if isinstance(maybe_parsed, dict):
            parsed = maybe_parsed
        else:
            parsed = {}
    except LLMOutputParseError:
        parsed = {}

    if not parsed:
        parsed = _extract_scores_from_text(raw_content)
        logger.warning("llm_scores_fallback_used extracted_keys=%s", list(parsed.keys()))

    if "competency_scores" in parsed and isinstance(parsed["competency_scores"], dict):
        parsed = parsed["competency_scores"]

    if not parsed:
        logger.warning("llm_scores_default_used reason=no-parse")
        parsed = {key: 5 for key in COMPETENCY_KEYS}

    normalized: dict[str, int] = {}
    for key in COMPETENCY_KEYS:
        value = parsed.get(key, 0)
        try:
            score = int(round(float(value)))
        except (TypeError, ValueError):
            score = 0
        normalized[key] = max(1, min(score, 10))

    return normalized
