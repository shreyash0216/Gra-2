from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
# Assuming your internal logic is in this folder
from app.services.prediction_service import prediction_service

app = FastAPI(title="GRA - Generative Resilience Agent API")

# Configure Gemini securely via Environment Variable (support both GOOGLE_API_KEY and GEMINI_API_KEY)
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("⚠️ WARNING: Neither GOOGLE_API_KEY nor GEMINI_API_KEY is configured in the environment variables.")

# CORS: Allow localhost for development and production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Development (commented out for production)
        # "http://localhost:3000",
        # "http://127.0.0.1:3000",
        # "http://localhost:5173",
        # "http://127.0.0.1:5173",
        # Production
        "https://gra-2-six.vercel.app",
        "https://genresai.me",
        "https://www.genresai.me",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class ChatRequest(BaseModel):
    user_input: str

# 1. Health Check (Must be at root / for App Runner)
@app.get("/")
def health_check():
    return {"status": "operational", "version": "1.0.0"}

# 2. Prediction Route (Changed from /predict to /predict)
@app.post("/predict")
def predict_crop(data: CropInput):
    recommendations = prediction_service.predict(data)
    return {"recommendations": recommendations}

# 3. Chat Route (REMOVED /api prefix)
@app.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API Key is not configured on the backend server. Please set the GOOGLE_API_KEY environment variable in your Render dashboard."
        )
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(request.user_input)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API Error: {str(e)}"
        )

@app.get("/market-prices")
def get_prices():
    return {"status": "success", "data": {"rice": 22000, "coffee": 45000}}

if __name__ == "__main__":
    import uvicorn
    # Important: Bind to 0.0.0.0 for Docker/App Runner
    uvicorn.run(app, host="0.0.0.0", port=8000)