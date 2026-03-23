"""
Question generation for candidate assessments.
"""
from core.errors import LLMOutputParseError
from models.candidate_model import QuestionItem
from services.json_parser import parse_llm_json_or_raise
from services.llm_client import chat_completion_with_retry


DEFAULT_QUESTION_COUNT = 100
QUESTION_BATCH_SIZE = 20


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


def generate_questions(candidate) -> list[QuestionItem]:
    """
    Generate assessment questions tailored to a candidate.

    Args:
        candidate: Candidate object with name, strengths, weaknesses, education, hobbies

    Returns:
        List of QuestionItem objects with questions and options
    """
    all_questions: list[QuestionItem] = []
    needed = DEFAULT_QUESTION_COUNT

    while len(all_questions) < needed:
        remaining = needed - len(all_questions)
        batch_count = min(QUESTION_BATCH_SIZE, remaining)

        prompt = f"""
You are an emotional intelligence assessment expert.

Candidate Information:
Name: {candidate.name}
Education: {candidate.education}
Hobbies: {candidate.hobbies}
Strengths: {candidate.strengths}
Weaknesses: {candidate.weaknesses}

Create {batch_count} multiple choice questions to test emotional intelligence (EQ).
Focus on situations related to their strengths, weaknesses, education background, and hobbies.

Return ONLY valid JSON object in this exact format:
{{
    "questions": [
        {{"question":"...", "options":["...","...","...","..."]}}
    ]
}}
"""
        raw_content = chat_completion_with_retry(prompt, json_mode=True)
        parsed = parse_llm_json_or_raise(raw_content)
        batch_items = _extract_question_items(parsed)

        all_questions.extend(batch_items[:batch_count])

    return all_questions[:needed]
