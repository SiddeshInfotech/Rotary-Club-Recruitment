const Groq = require("groq-sdk");

let groq = null;

/**
 * Initialize the Groq AI client.
 * Called once at server startup.
 */
const initializeAI = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    console.warn(
      "⚠️  GROQ_API_KEY not set. AI features will not work. " +
        "Get a free key at https://console.groq.com/keys"
    );
    return false;
  }
  groq = new Groq({ apiKey });
  console.log("AI Service: Groq AI client initialized (llama-3.3-70b-versatile)");
  return true;
};

/**
 * Send a prompt to Groq and get a text response.
 * @param {string} prompt - The full prompt to send
 * @returns {string} The AI's text response
 */
const generateContent = async (prompt) => {
  if (!groq) {
    throw new Error(
      "AI client not initialized. Please set GROQ_API_KEY in .env"
    );
  }

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || "";
};

/**
 * Send a prompt and parse the response as JSON.
 * Handles markdown code fences that AI sometimes wraps around JSON.
 * @param {string} prompt - The prompt (should ask for JSON output)
 * @returns {object} Parsed JSON object
 */
const generateJSON = async (prompt) => {
  // Try using Groq's JSON mode specifically
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });

  let text = completion.choices[0]?.message?.content || "";

  // Strip markdown code fences if present (just in case)
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", cleaned.substring(0, 200));
    throw new Error("AI returned invalid JSON. Please try again.");
  }
};

module.exports = { initializeAI, generateContent, generateJSON };
