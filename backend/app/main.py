from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.prediction_service import prediction_service

app = FastAPI(title="GRA - Generative Resilience Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.get("/")
def health_check():
    return {"status": "operational", "version": "1.0.0"}

@app.post("/predict")
def predict_crop(data: CropInput):
    recommendations = prediction_service.predict(data)
    return {"recommendations": recommendations}

@app.get("/market-prices")
def get_prices():
    # Placeholder for a real price service
    return {"status": "success", "data": {"rice": 22000, "coffee": 45000}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
