// src/services/geminiService.ts

export const getGeminiResponse = async (prompt: string) => {
  // We use '/api' because the Amplify Rewrite will handle the rest!
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_input: prompt })
  });
  return response.json();
};