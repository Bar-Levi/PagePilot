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
      model: "googleai/gemini-2.5-flash",
    });
  }

  return aiInstance;
};
