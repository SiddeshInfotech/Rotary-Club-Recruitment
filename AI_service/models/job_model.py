from typing import Any

from pydantic import BaseModel, Field


class JobInput(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=10)
    required_skills: str = Field(..., min_length=2)


class MatchJobInput(BaseModel):
    id: str | int
    eq_requirements: dict[str, float]
    weights: dict[str, float] | None = None


class MatchRequest(BaseModel):
    candidate_scores: dict[str, float]
    jobs: list[MatchJobInput]


class ProcessJobResponse(BaseModel):
    job_profile: str
    embedding: list[float]


class MatchResultItem(BaseModel):
    job_id: str | int
    match_score: float


class MatchResponse(BaseModel):
    results: list[MatchResultItem]


class ErrorPayload(BaseModel):
    error: dict[str, Any]