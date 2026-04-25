from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
# Assuming your internal logic is in this folder
from app.services.prediction_service import prediction_service

app = FastAPI(title="GRA - Generative Resilience Agent API")

# Configure Gemini securely via Environment Variable
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# CORS: Allow your specific domains + localhost for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://genresai.me", 
        "https://www.genresai.me",
        "https://main.d1zk8huugqz2c1.amplifyapp.com" # Your Amplify test URL
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
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(request.user_input)
    return {"reply": response.text}

@app.get("/market-prices")
def get_prices():
    return {"status": "success", "data": {"rice": 22000, "coffee": 45000}}

if __name__ == "__main__":
    import uvicorn
    # Important: Bind to 0.0.0.0 for Docker/App Runner
    uvicorn.run(app, host="0.0.0.0", port=8000)