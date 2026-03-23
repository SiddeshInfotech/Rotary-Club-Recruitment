from fastapi import APIRouter

from core.security import ServiceAuthDependency
from models.candidate_model import (
    Answers,
    Candidate,
    CandidateInput,
    CompetencyScores,
    EvaluateAnswersResponse,
    GenerateConclusionResponse,
    GenerateEQTestResponse,
    ProcessCandidateResponse,
)
from models.job_model import JobInput, MatchRequest, MatchResponse, MatchResultItem, ProcessJobResponse
from services.question_services import (
    build_job_profile,
    build_profile,
    calculate_match,
    evaluate_answers,
    generate_conclusion,
    generate_embedding,
    generate_questions,
)

router = APIRouter(dependencies=[ServiceAuthDependency])


@router.post("/generate-eq-test", response_model=GenerateEQTestResponse)
def create_test(candidate: Candidate):
    questions = generate_questions(candidate)
    return GenerateEQTestResponse(candidate_id=candidate.id, questions=questions)


@router.post("/evaluate-answers", response_model=EvaluateAnswersResponse)
def submit_answers(answers_data: Answers):
    # Placeholder candidate context until candidate persistence is connected.
    candidate = Candidate(
        id=answers_data.candidate_id,
        name="Test Candidate",
        strengths=["Communication"],
        weaknesses=["Time management"],
    )
    scores = evaluate_answers(candidate, answers_data.answers)
    return EvaluateAnswersResponse(candidate_id=answers_data.candidate_id, competency_scores=scores)


@router.post("/generate-conclusion", response_model=GenerateConclusionResponse)
def create_conclusion(scores_data: CompetencyScores):
    # Placeholder candidate context until candidate persistence is connected.
    candidate = Candidate(
        id=scores_data.candidate_id,
        name="Test Candidate",
        strengths=["Communication"],
        weaknesses=["Time management"],
    )
    conclusion = generate_conclusion(candidate, scores_data.competency_scores)
    return GenerateConclusionResponse(candidate_id=scores_data.candidate_id, conclusion=conclusion)


@router.post("/process-candidate", response_model=ProcessCandidateResponse)
def process_candidate(data: CandidateInput):
    scores = evaluate_answers(data, data.answers)
    conclusion = generate_conclusion(data, scores)
    profile = build_profile(data, scores, conclusion)
    embedding = generate_embedding(profile)

    return ProcessCandidateResponse(
        profile=profile,
        scores=scores,
        conclusion=conclusion,
        embedding=embedding,
    )


@router.post("/process-job", response_model=ProcessJobResponse)
def process_job(job: JobInput):
    profile = build_job_profile(job)
    embedding = generate_embedding(profile)
    return ProcessJobResponse(job_profile=profile, embedding=embedding)


@router.post("/match-candidate-job", response_model=MatchResponse)
def match_candidate_job(data: MatchRequest):
    results: list[MatchResultItem] = []

    for job in data.jobs:
        score = calculate_match(data.candidate_scores, job.eq_requirements, job.weights)
        results.append(MatchResultItem(job_id=job.id, match_score=round(score, 3)))

    results.sort(key=lambda item: item.match_score, reverse=True)
    return MatchResponse(results=results)
    