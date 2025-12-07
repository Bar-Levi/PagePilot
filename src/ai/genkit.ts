// Only initialize AI if API key is available
const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Lazy initialization of AI
let aiInstance: any = null;

export const getAI = async () => {
  if (!hasApiKey) {
    return null;
  }

  if (!aiInstance) {
    const { genkit } = await import("genkit");
    const { googleAI } = await import("@genkit-ai/google-genai");
    aiInstance = genkit({
      plugins: [googleAI()],
      model: "googleai/gemini-1.5-flash",
    });
  }

  return aiInstance;
};

export const FALLBACK_MODELS = [
  "googleai/gemini-2.5-flash",      // מודל מהיר וחזק כללי
  "googleai/gemini-2.5-flash-lite", // זול ומהיר מאוד, טוב ל-traffic גבוה
  "googleai/gemini-2.5-pro",       // מודל חזק יותר לחשיבה עמוקה
  "googleai/gemini-2.0-flash",     // גיבוי נוסף למקרה שיש בעיה עם 2.5
];

