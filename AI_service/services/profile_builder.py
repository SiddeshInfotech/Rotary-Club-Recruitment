"""
Profile and conclusion building for candidates and jobs.
"""
from services.llm_client import chat_completion_with_retry


def generate_conclusion(candidate, competency_scores: dict[str, int]) -> str:
    """
    Generate a professional assessment conclusion for a candidate.

    Args:
        candidate: Candidate object with all attributes
        competency_scores: Dictionary of competency -> score mappings

    Returns:
        Concise 2-sentence professional assessment
    """
    scores_text = "\n".join([f"- {competency}: {score}/10" for competency, score in competency_scores.items()])

    prompt = f"""
You are a professional HR consultant and competency assessment expert.

Candidate Information:
Name: {candidate.name}
Education: {candidate.education}
Hobbies: {candidate.hobbies}
Strengths: {candidate.strengths}
Weaknesses: {candidate.weaknesses}

Competency Assessment Results:
{scores_text}

Based on the candidate's background and competency scores, return exactly 1 string, professional sentence (max 40 words total):
plain text (no bullet points, no numbering). The sentence must summarize overall assessment and key strengths
"""

    return chat_completion_with_retry(prompt).strip()


def build_profile(candidate, competency_scores: dict[str, int], conclusion: str) -> str:
    """
    Build a comprehensive candidate profile text.

    Args:
        candidate: Candidate object
        competency_scores: Dictionary of competency scores
        conclusion: Assessment conclusion text

    Returns:
        Formatted profile string
    """
    strengths = candidate.strengths if isinstance(candidate.strengths, list) else [candidate.strengths]
    weaknesses = candidate.weaknesses if isinstance(candidate.weaknesses, list) else [candidate.weaknesses]
    hobbies = candidate.hobbies if isinstance(candidate.hobbies, list) else [candidate.hobbies]
    candidate_id = getattr(candidate, "id", "N/A")
    education = getattr(candidate, "education", "")

    return f"""
Candidate ID: {candidate_id}
Candidate Name: {candidate.name}

Education: {education}
Hobbies: {hobbies}
Strengths: {strengths}
Weaknesses: {weaknesses}

Competency Scores:
Leadership: {competency_scores.get('Leadership', 'N/A')}
Loyalty: {competency_scores.get('Loyalty', 'N/A')}
Adaptability: {competency_scores.get('Adaptability', 'N/A')}
Growth Mindset: {competency_scores.get('Growth Mindset', 'N/A')}
Reliability: {competency_scores.get('Reliability', 'N/A')}
Teamwork: {competency_scores.get('Teamwork', 'N/A')}
Collaboration: {competency_scores.get('Collaboration', 'N/A')}
Problem Solving: {competency_scores.get('Problem Solving', 'N/A')}

Final Evaluation:
{conclusion}
""".strip()


def build_job_profile(job) -> str:
    """
    Build a job profile text from job information.

    Args:
        job: Job object with title, description, required_skills

    Returns:
        Formatted job profile string
    """
    return f"""
Job Title: {job.title}
Description: {job.description}
Required Skills: {job.required_skills}
""".strip()
