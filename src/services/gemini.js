// services/gemini.js
//
// Thin wrapper around the Firebase AI Logic model.
// Keeping this separate from the components means:
//  - the prompt design lives in one place
//  - it's easy to swap models later
//  - components don't need to know anything about Gemini's API shape

import { model } from "../firebase";

const SYSTEM_INSTRUCTION = `You are an assistant inside a school project-planning tool
called ProjectenPlaats. Given a short, informal idea for a student project,
respond with ONLY a JSON object (no markdown fences, no extra text) with this
exact shape:

{
  "title": string,
  "description": string,
  "objectives": string[],
  "tasks": string[],
  "skills": string[],
  "deliverables": string[]
}

Rules:
- 1 short title.
- description: 1-3 sentences.
- objectives: 2-4 items.
- tasks: 3-6 items.
- skills: 2-5 items.
- deliverables: 1-3 items.
- If the idea is nonsensical, empty, or not a real project idea, still return
  valid JSON in the same shape, but make the title "Unclear project idea" and
  explain in "description" that the input needs more detail. Leave the other
  arrays as sensible short placeholders rather than omitting them.
- Never include any text outside the JSON object.`;

/**
 * Ask Gemini to turn a rough idea into a structured project plan.
 * @param {string} ideaText
 * @returns {Promise<object>} parsed project object
 */
export async function generateProject(ideaText) {
  const prompt = `${SYSTEM_INSTRUCTION}\n\nStudent idea:\n"""${ideaText}"""`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return parseProjectJson(responseText);
}

/**
 * Gemini is instructed to return raw JSON, but models sometimes wrap output
 * in ```json fences anyway. Strip those defensively before parsing.
 */
function parseProjectJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      "Gemini returned a response that wasn't valid JSON. Raw response: " +
        cleaned.slice(0, 300)
    );
  }
}
