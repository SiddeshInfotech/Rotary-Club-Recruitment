const { generateJSON } = require("./aiClient");

/**
 * Generate 25 Technical Skills assessment questions tailored to the candidate's skills.
 *
 * The questions are distributed across 5 technical dimensions:
 * - fundamentals (5 questions): Core language/framework concepts, syntax, semantics
 * - architecture (5 questions): System design, design patterns, scalability
 * - debugging (5 questions): Identifying bugs from code/error descriptions
 * - bestPractices (5 questions): Idiomatic code, security, performance patterns
 * - tooling (5 questions): Dev tools, version control, CI/CD, testing
 *
 * Each question has a difficulty level (easy, medium, hard) with weighted scoring.
 *
 * @param {object} candidate - The candidate document from MongoDB
 * @param {string} candidate.name
 * @param {string} candidate.title
 * @param {string[]} candidate.skills
 * @returns {object[]} Array of 25 question objects
 */
const generateTechQuestions = async (candidate) => {
  const { name, title, skills } = candidate;

  if (!skills || skills.length === 0) {
    throw new Error(
      "Candidate has no skills listed. Please update the candidate profile with skills before generating a technical assessment."
    );
  }

  const prompt = `You are an expert Technical Skills assessment designer for a professional job portal.

A candidate has the following profile:
- Name: ${name}
- Title: ${title || "Not specified"}
- Skills: ${skills.join(", ")}

Generate exactly 25 Technical Multiple Choice Questions (MCQs) to evaluate this candidate's hard/technical skills. The questions must be:

1. **Relevant** to the candidate's listed skills and technology stack
2. **Practical** — test real-world knowledge, not trivia
3. **Include code snippets** where appropriate — especially for "debugging" and "fundamentals" dimensions. Include realistic code examples the candidate might encounter in their work.
4. **Distributed** across these 5 technical dimensions (exactly 5 questions each, totaling 25):
   - "fundamentals": Core language/framework concepts, syntax, semantics
   - "architecture": System design, design patterns, scalability thinking
   - "debugging": Identifying bugs, fixing errors, reading stack traces
   - "bestPractices": Idiomatic code, security patterns, performance optimization
   - "tooling": Dev tools, version control, CI/CD, testing frameworks

5. **Difficulty distribution** across all 25 questions:
   - 8 questions should be "easy"
   - 9 questions should be "medium"
   - 8 questions should be "hard"
   Distribute difficulties across all dimensions (not all easy in one dimension).

Each question MUST have:
- A populated 'options' array containing EXACTLY 4 JSON objects (A, B, C, D)
- A 'codeSnippet' field (string) — include a code snippet if the question involves code. Use empty string "" if no code is needed.
- A 'codeLanguage' field (string) — the programming language of the code snippet (e.g., "javascript", "python", "java"). Use empty string "" if no code snippet.

Assign a score to each option based on technical correctness:

For "easy" questions (max score 5):
- 5 = Correct answer
- 3 = Partially correct
- 1 = Common misconception
- 0 = Incorrect

For "medium" questions (max score 8):
- 8 = Correct answer
- 5 = Partially correct
- 2 = Common misconception
- 0 = Incorrect

For "hard" questions (max score 10):
- 10 = Correct answer
- 6 = Partially correct
- 2 = Common misconception
- 0 = Incorrect

Return ONLY a valid JSON object. DO NOT include introductory or concluding text.
Here is the exact JSON structure you MUST follow:
{
  "questions": [
    {
      "id": 1,
      "dimension": "fundamentals",
      "difficulty": "easy",
      "question": "Your technical question here...",
      "codeSnippet": "function example() {\\n  const x = 1;\\n  return x;\\n}",
      "codeLanguage": "javascript",
      "options": [
        { "id": "A", "text": "Option A text...", "score": 0 },
        { "id": "B", "text": "Option B text (correct)...", "score": 5 },
        { "id": "C", "text": "Option C text...", "score": 1 },
        { "id": "D", "text": "Option D text...", "score": 3 }
      ]
    }
  ]
}

Ensure all 25 questions are in the array. Do not include any text outside the JSON object.`;

  const result = await generateJSON(prompt);

  // Validate the response structure
  if (!result.questions || !Array.isArray(result.questions)) {
    throw new Error("AI response missing 'questions' array");
  }

  if (result.questions.length < 25) {
    throw new Error(
      `AI generated only ${result.questions.length} questions, expected 25. Please retry.`
    );
  }

  // Validate and normalize each question
  const validDimensions = ["fundamentals", "architecture", "debugging", "bestPractices", "tooling"];
  const validDifficulties = ["easy", "medium", "hard"];

  for (const q of result.questions) {
    if (!validDimensions.includes(q.dimension)) {
      console.warn(`Question ${q.id} has invalid dimension: ${q.dimension}, defaulting to "fundamentals"`);
      q.dimension = "fundamentals";
    }
    if (!validDifficulties.includes(q.difficulty)) {
      console.warn(`Question ${q.id} has invalid difficulty: ${q.difficulty}, defaulting to "medium"`);
      q.difficulty = "medium";
    }
    if (!q.codeSnippet) q.codeSnippet = "";
    if (!q.codeLanguage) q.codeLanguage = "";
    if (!q.options || q.options.length !== 4) {
      throw new Error(`Question ${q.id} does not have exactly 4 options.`);
    }
  }

  return result.questions;
};

module.exports = { generateTechQuestions };
