import { VillageData } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getPrediction = async (data: VillageData) => {
  try {
    // Use /api proxy in dev, direct URL in production
    const endpoint = import.meta.env.DEV ? '/api/predict' : `${API_BASE_URL}/predict`;
    
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

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    const json = await res.json();
    return {
      ...json,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      village_data: data
    };
  } catch (error) {
    console.error("Prediction API Error:", error);
    throw error;
  }
};