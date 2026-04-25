// frontend/src/services/geminiService.ts

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    console.log('📤 Sending chat request:', prompt);
    
    // Amplify proxies /api/chat → backend.genresai.me/chat
    const endpoint = '/api/chat';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ user_input: prompt })
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      throw new Error(`Backend error (${response.status}): ${errorText || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    
    if (!data.reply) {
      throw new Error('Invalid response format: missing "reply" field');
    }

    return data.reply;
  } catch (error) {
    console.error("❌ Gemini Service Error:", error);
    
    // Provide helpful error messages
    // if (error instanceof TypeError && error.message.includes('fetch')) {
    //   throw new Error('Backend connection failed. Is your FastAPI server running on port 8000? Try running: ./dev.sh');
    // }
    
    throw error;
  }
};