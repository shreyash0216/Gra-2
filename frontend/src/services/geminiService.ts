// frontend/src/services/geminiService.ts

export const getGeminiResponse = async (prompt: string) => {
  try {
    // We use '/api/chat' because Amplify will proxy this to your backend
    const response = await fetch('/api/chat', { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ user_input: prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Backend connection failed');
    }

    const data = await response.json();
    return data.reply; // This matches the {"reply": ...} from your FastAPI
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};