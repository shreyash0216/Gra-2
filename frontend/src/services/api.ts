import { VillageData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getPrediction = async (data: VillageData) => {
  try {
    // Dev proxy commented out for production
    // const endpoint = import.meta.env.DEV ? '/api/predict' : `${API_BASE_URL}/predict`;
    const endpoint = `${API_BASE_URL}/predict`;
    
    console.log('📤 Sending prediction request to:', endpoint);
    
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        N: 90, // Hardcoded defaults as requested
        P: 40,
        K: 40,
        temperature: data.avg_temp || 25,
        humidity: 80,
        ph: 6.5,
        rainfall: data.annual_rainfall
      })
    });

    console.log('📥 Prediction response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Backend error:', errorText);
      throw new Error(`Prediction failed (${res.status}): ${errorText || 'Backend error'}`);
    }

    const json = await res.json();
    console.log('✅ Prediction result:', json);
    
    return {
      ...json,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      village_data: data
    };
  } catch (error) {
    console.error("❌ Prediction API Error:", error);
    
    // Provide helpful error messages
    // if (error instanceof TypeError && error.message.includes('fetch')) {
    //   throw new Error('Backend connection failed. Is your FastAPI server running on port 8000? Try running: ./dev.sh');
    // }
    
    throw error;
  }
};