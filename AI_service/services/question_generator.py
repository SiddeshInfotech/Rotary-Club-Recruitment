"""
Question generation for candidate assessments.
"""
from concurrent.futures import ThreadPoolExecutor

from core.errors import LLMOutputParseError
from models.candidate_model import QuestionItem
from services.llm_client import chat_completion_with_retry
from services.json_parser import parse_llm_json_or_raise


DEFAULT_QUESTION_COUNT = 100
QUESTION_BATCH_SIZE = 20
MAX_PARALLEL_BATCHES = 4


def _extract_question_items(parsed_payload: object) -> list[QuestionItem]:
    if isinstance(parsed_payload, dict):
        items = parsed_payload.get("questions")
    elif isinstance(parsed_payload, list):
        items = parsed_payload
    else:
        items = None

    if not isinstance(items, list):
        raise LLMOutputParseError("Expected questions as a JSON array")

    batch_items = [QuestionItem.model_validate(item) for item in items]
    if not batch_items:
        raise LLMOutputParseError("LLM returned an empty questions batch")

    return batch_items


def _build_questions_prompt(candidate, batch_count: int) -> str:
    return f"""
You are an emotional intelligence assessment expert.

Candidate Information:
Name: {candidate.name}
Education: {candidate.education}
Hobbies: {candidate.hobbies}
Strengths: {candidate.strengths}
Weaknesses: {candidate.weaknesses}

Create EXACTLY {batch_count} multiple choice questions to test emotional intelligence (EQ).
Focus on situations related to their strengths, weaknesses, education background, and hobbies.

IMPORTANT: You MUST provide exactly {batch_count} questions. Do not return more or fewer.
Each question must have exactly 4 options.

Return ONLY valid JSON object in this exact format:
{{
    "questions": [
        {{"question":"...", "options":["...","...","...","..."]}}
    ]
}}

The array must contain exactly {batch_count} items.
"""


def _generate_question_batch(candidate, batch_count: int) -> list[QuestionItem]:
    prompt = _build_questions_prompt(candidate, batch_count)
    raw_content = chat_completion_with_retry(prompt, json_mode=True)
    parsed = parse_llm_json_or_raise(raw_content)
    items = _extract_question_items(parsed)
    return items[:batch_count]


def generate_questions(candidate) -> list[QuestionItem]:
    """
    Generate assessment questions tailored to a candidate.

    Args:
        candidate: Candidate object with name, strengths, weaknesses, education, hobbies

    Returns:
        List of QuestionItem objects with questions and options
    """
    needed = DEFAULT_QUESTION_COUNT
    batch_sizes: list[int] = []
    remaining = needed
    while remaining > 0:
        size = min(QUESTION_BATCH_SIZE, remaining)
        batch_sizes.append(size)
        remaining -= size

    indexed_batches: dict[int, list[QuestionItem]] = {}
    max_workers = min(MAX_PARALLEL_BATCHES, len(batch_sizes))

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(_generate_question_batch, candidate, size): index
            for index, size in enumerate(batch_sizes)
        }

        for future, index in futures.items():
            indexed_batches[index] = future.result()

    all_questions: list[QuestionItem] = []
    for index in range(len(batch_sizes)):
        all_questions.extend(indexed_batches[index])

    # If we fell short, generate additional questions to reach the target
    if len(all_questions) < needed:
        shortfall = needed - len(all_questions)
        additional = _generate_question_batch(candidate, shortfall)
        all_questions.extend(additional)

    return all_questions[:needed]
