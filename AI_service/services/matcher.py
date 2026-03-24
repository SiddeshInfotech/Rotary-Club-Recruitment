"""
Candidate-to-job matching algorithm.
"""

import math


COMPETENCY_ALIASES: dict[str, list[str]] = {
    "communication": ["collaboration", "teamwork"],
    "strategic thinking": ["problem solving", "adaptability", "growth mindset"],
    "leadership": ["reliability", "teamwork"],
}


def _normalized(value: str) -> str:
    return value.strip().lower()


def _find_candidate_score(candidate: dict[str, float], competency: str) -> float:
    normalized_candidate = {_normalized(key): float(value) for key, value in candidate.items()}
    normalized_competency = _normalized(competency)

    if normalized_competency in normalized_candidate:
        return normalized_candidate[normalized_competency]

    # Use the best score among related competencies if direct key is missing.
    aliases = COMPETENCY_ALIASES.get(normalized_competency, [])
    alias_scores = [normalized_candidate[alias] for alias in aliases if alias in normalized_candidate]
    if alias_scores:
        return max(alias_scores)

    return 0.0


def _clamp_score(value: float) -> float:
    return max(0.0, min(value, 1.0))


def cosine_similarity(candidate_embedding: list[float], job_embedding: list[float]) -> float | None:
    """
    Calculate cosine similarity between two vectors and normalize to [0, 1].

    Returns None when vectors are invalid for cosine similarity.
    """
    if not candidate_embedding or not job_embedding:
        return None
    if len(candidate_embedding) != len(job_embedding):
        return None

    candidate_norm = math.sqrt(sum(value * value for value in candidate_embedding))
    job_norm = math.sqrt(sum(value * value for value in job_embedding))
    if candidate_norm == 0 or job_norm == 0:
        return None

    dot_product = sum(c * j for c, j in zip(candidate_embedding, job_embedding))
    cosine = dot_product / (candidate_norm * job_norm)
    cosine = max(-1.0, min(cosine, 1.0))

    # Normalize from [-1, 1] to [0, 1] for blending with competency score.
    return _clamp_score((cosine + 1.0) / 2.0)


def _competency_match_score(candidate: dict[str, float], job: dict[str, float], weights: dict[str, float] | None = None) -> float:
    total_score = 0.0
    total_weight = 0.0

    for key, j_val in job.items():
        c_val = _find_candidate_score(candidate, key)
        weight = float(weights.get(key, 1.0)) if weights else 1.0

        diff = abs(float(c_val) - float(j_val))
        similarity = (10 - diff) / 10

        total_score += similarity * weight
        total_weight += weight

    if total_weight == 0:
        return 0.0

    return _clamp_score(total_score / total_weight)


def calculate_match(
    candidate: dict[str, float],
    job: dict[str, float],
    weights: dict[str, float] | None = None,
    candidate_embedding: list[float] | None = None,
    job_embedding: list[float] | None = None,
    semantic_weight: float = 0.3,
) -> float:
    """
    Calculate a match score between candidate competencies and job requirements.

    Uses weighted similarity based on competency overlap.

    Args:
        candidate: Dictionary of competency -> score (candidate scores)
        job: Dictionary of competency -> score (job requirements)
        weights: Optional dictionary of competency -> weight for custom weighting
        candidate_embedding: Optional candidate embedding vector
        job_embedding: Optional job embedding vector
        semantic_weight: Blend weight for embedding similarity in [0.0, 1.0]

    Returns:
        Match score in range [0.0, 1.0] where 1.0 is perfect match
    """
    competency_score = _competency_match_score(candidate, job, weights)

    semantic_score = None
    if candidate_embedding is not None and job_embedding is not None:
        semantic_score = cosine_similarity(candidate_embedding, job_embedding)

    if semantic_score is None:
        return competency_score

    blend_weight = _clamp_score(semantic_weight)
    blended_score = (1.0 - blend_weight) * competency_score + blend_weight * semantic_score
    return _clamp_score(blended_score)
