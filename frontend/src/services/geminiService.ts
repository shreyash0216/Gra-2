import { GoogleGenerativeAI } from "@google/generative-ai";

export const getExplanation = async (crop: string, rainfall: number, ph: number): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return "Gemini API key missing. Cannot provide AI explanation.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    As a professional agricultural climate resilience expert, briefly explain why ${crop} 
    is a good recommendation for a region with ${rainfall}mm annual rainfall and a soil pH of ${ph}.
    Highlight one specific resilience tip for this crop.
    Keep it under 3 sentences.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "AI was unable to generate an explanation at this time.";
  }
};