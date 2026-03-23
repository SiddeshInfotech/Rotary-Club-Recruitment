from pydantic import BaseModel, Field


class Candidate(BaseModel):
    id: int = Field(..., ge=1)
    name: str = Field(..., min_length=1, max_length=120)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    education: str = Field(default="", max_length=500)
    hobbies: list[str] = Field(default_factory=list)


class Answers(BaseModel):
    candidate_id: int = Field(..., ge=1)
    answers: list[str] = Field(..., min_length=1)


class CompetencyScores(BaseModel):
    candidate_id: int = Field(..., ge=1)
    competency_scores: dict[str, int]


class CandidateInput(BaseModel):
    id: int | None = Field(default=None, ge=1)
    name: str = Field(..., min_length=1, max_length=120)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    education: str = Field(default="", max_length=500)
    hobbies: list[str] = Field(default_factory=list)
    answers: list[str] = Field(..., min_length=1)


class QuestionItem(BaseModel):
    question: str = Field(..., min_length=1)
    options: list[str] = Field(..., min_length=2)


class GenerateEQTestResponse(BaseModel):
    candidate_id: int
    questions: list[QuestionItem]


class EvaluateAnswersResponse(BaseModel):
    candidate_id: int
    competency_scores: dict[str, int]


class GenerateConclusionResponse(BaseModel):
    candidate_id: int
    conclusion: str


class ProcessCandidateResponse(BaseModel):
    profile: str
    scores: dict[str, int]
    conclusion: str
    embedding: list[float]
