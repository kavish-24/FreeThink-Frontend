
import axios from "axios";

const OPENROUTER_API_KEY = "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";

export const getSuggestions = async (prompt, field) => {
  try {
    let systemPrompt = '';
    if (field === 'Job Description') {
      systemPrompt = `Generate up to 3 detailed job description suggestions for a job titled "${prompt}". Each description should be 200-300 characters, covering key responsibilities and requirements relevant to the job title. Ensure the suggestions are professional, concise, and varied. Return as a list of strings.`;
    } else if (field === 'Job Tags') {
      systemPrompt = `Generate up to 15 job tag suggestions for a job titled "${prompt}". Provide tags as a single comma-separated string (e.g., "remote, full-time, tech, agile"). Ensure tags are relevant, professional, and reflect common job attributes or technologies associated with the job title. Return as a list containing one string.`;
    } else if (field === 'Key Skills') {
      systemPrompt = `Generate up to 15 key skill suggestions for a job titled "${prompt}". Provide skills as a single comma-separated string (e.g., "JavaScript, Python, SQL"). Ensure skills are relevant, professional, and specific to the job title. Return as a list containing one string.`;
    } else {
      return []; // Return empty array for unsupported fields
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: systemPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:9000",
          "X-Title": "JobHub",
          "Content-Type": "application/json",
        },
      }
    );

const text = response.data.choices?.[0]?.message?.content || '';
if (field === 'Job Tags' || field === 'Key Skills') {
  // Split comma-separated suggestions into array
  return text
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}
// Clean AI text for Job Description
const cleanText = text
  .replace(/^\s*\d+\.\s*/gm, "")
  .replace(/\n{2,}/g, "\n\n")
  .trim();

return cleanText ? [cleanText] : []; // always return array

  } catch (err) {
    console.error(`OpenRouter Mistral error for ${field}:`, err);
    return [];
  }
};