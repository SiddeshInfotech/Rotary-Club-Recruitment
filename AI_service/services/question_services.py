"""
Main orchestration module for competency assessment and matching.

This module serves as the public API for:
- Question generation for candidates
- Answer evaluation and competency scoring
- Profile and conclusion generation
- Candidate-to-job matching

All heavy lifting is delegated to specialized submodules.
"""

# Public API exports
from services.embeddings import generate_embedding
from services.competency_evaluator import COMPETENCY_KEYS, evaluate_answers
from services.matcher import calculate_match
from services.profile_builder import build_job_profile, build_profile, generate_conclusion
from services.question_generator import generate_questions

__all__ = [
    "COMPETENCY_KEYS",
    "generate_questions",
    "evaluate_answers",
    "generate_conclusion",
    "build_profile",
    "build_job_profile",
    "generate_embedding",
    "calculate_match",
]
