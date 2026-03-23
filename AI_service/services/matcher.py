"""
Candidate-to-job matching algorithm.
"""


def calculate_match(candidate: dict[str, float], job: dict[str, float], weights: dict[str, float] | None = None) -> float:
    """
    Calculate a match score between candidate competencies and job requirements.

    Uses weighted similarity based on competency overlap.

    Args:
        candidate: Dictionary of competency -> score (candidate scores)
        job: Dictionary of competency -> score (job requirements)
        weights: Optional dictionary of competency -> weight for custom weighting

    Returns:
        Match score in range [0.0, 1.0] where 1.0 is perfect match
    """
    total_score = 0.0
    total_weight = 0.0

    for key in candidate:
        c_val = candidate.get(key, 0)
        j_val = job.get(key, 0)
        weight = weights.get(key, 1.0) if weights else 1.0

        diff = abs(float(c_val) - float(j_val))
        similarity = (10 - diff) / 10

        total_score += similarity * float(weight)
        total_weight += float(weight)

    if total_weight == 0:
        return 0.0

    return max(0.0, min(total_score / total_weight, 1.0))
