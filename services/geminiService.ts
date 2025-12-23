import { GoogleGenAI, Type } from "@google/genai";
import { VillageData, AdaptationPlan } from "../types";

const planSchema = {
  type: Type.OBJECT,
  properties: {
    regional_context: { type: Type.STRING },
    strategies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          focus: { type: Type.STRING },
          summary: { type: Type.STRING },
          total_investment: { type: Type.NUMBER },
          crops: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                planting_date: { type: Type.STRING },
                irrigation_schedule: { type: Type.STRING },
                expected_yield_improvement: { type: Type.STRING },
                risk_factor: { type: Type.STRING }
              },
              required: ["name", "planting_date", "irrigation_schedule", "expected_yield_improvement", "risk_factor"]
            }
          },
          structures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                location_type: { type: Type.STRING },
                estimated_cost: { type: Type.NUMBER }
              },
              required: ["name", "purpose", "location_type", "estimated_cost"]
            }
          },
          blueprints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                visual_type: { type: Type.STRING, enum: ["pond", "dam", "drainage", "layout"] },
                technical_specs: { type: Type.ARRAY, items: { type: Type.STRING } },
                estimated_timeline: { type: Type.STRING },
                material_list: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      quantity: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ["id", "title", "description", "technical_specs", "estimated_timeline", "material_list"]
            }
          }
        },
        required: ["id", "label", "focus", "summary", "crops", "structures", "blueprints", "total_investment"]
      }
    }
  },
  required: ["strategies", "regional_context"]
};

// Use GoogleGenAI to generate the adaptation plan with search grounding
export const generateAdaptationPlan = async (data: VillageData): Promise<AdaptationPlan> => {
  // Always use process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are the 'Generative Resilience Agent (GRA)', a high-precision adaptation assistant for India's grassroots.
    Your mission is to turn climate uncertainty into local, actionable plans for: ${data.village}.
    
    Regional Context:
    - Geo: ${data.latitude}, ${data.longitude}
    - Soil Profile: ${data.soil_type}
    - Rainfall Dynamics: ${data.annual_rainfall}mm
    - Current Farming: ${data.crops_current.join(", ")}
    - Hydro-Context: ${data.groundwater_depth}m groundwater, History: ${data.flood_history}

    Generate 3 Hyper-Local Strategies:
    1. 'Conservation First' (Focus: Native soil health, low-cost moisture retention, local seeds).
    2. 'Climate Transition' (Focus: Transitioning to drought-tolerant varieties, micro-irrigation, and market-linked timing).
    3. 'Infrastructure Heavy' (Focus: Structural engineering like farm ponds, recharge pits, and ward-level drainage).

    Technical Requirements:
    - Provide exact crops with planting dates adjusted for 2025 climate projections.
    - Structures MUST include realistic cost estimates in INR based on current market rates.
    - Blueprints MUST include a visual_type property set to one of: 'pond', 'dam', 'drainage', or 'layout'.
    - Blueprints MUST be technical and engineering-style, detailing materials (cement, plastic lining, labor) and construction timelines.
    
    Use Google Search to cross-reference current government schemes (e.g., PMKSY) that can subsidize these costs.
    Ensure the JSON response strictly matches the schema.
  `;

  try {
    // Generate content using the correct method and model for complex reasoning
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        tools: [{ googleSearch: {} }]
      },
    });

    // Directly access the text property as per extraction rules
    const responseText = response.text;
    if (!responseText) throw new Error("AI engine failed to respond.");
    
    const plan = JSON.parse(responseText) as AdaptationPlan;
    plan.id = `plan_${Date.now()}`;
    plan.timestamp = Date.now();
    plan.village_data = data;
    
    // Extract grounding URLs for full transparency as per Search Grounding rules
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      plan.sources = groundingChunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          title: c.web.title,
          uri: c.web.uri
        }));
    }

    return plan;
  } catch (error) {
    console.error("GRA Logic Error:", error);
    throw error;
  }
};