import joblib
import os
import pandas as pd
from pydantic import BaseModel

class PredictionService:
    def __init__(self):
        # Path to models/crop_model.pkl from backend/app/services/
        self.model_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models", "crop_model.pkl")
        self.model = None
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            print(f"⚠️ Model not found at {self.model_path}")

    def apply_feature_engineering(self, data):
        # Feature Parity with training scripts/data_pipeline.py
        feat_dict = {
            "N": data.N, "P": data.P, "K": data.K,
            "temperature": data.temperature, "humidity": data.humidity,
            "ph": data.ph, "rainfall": data.rainfall
        }
        feat_dict["temp_humidity"] = data.temperature * data.humidity
        feat_dict["npk_ratio"] = data.N / (data.P + data.K + 1)
        feat_dict["soil_score"] = data.ph * data.N
        feat_dict["climate_index"] = data.temperature * data.rainfall
        feat_dict["water_availability"] = data.rainfall / (data.temperature + 1)
        
        return pd.DataFrame([feat_dict])

    def predict(self, data):
        if not self.model:
            return {"error": "Model not found"}
        
        features_df = self.apply_feature_engineering(data)
        probs = self.model.predict_proba(features_df)[0]
        crops = self.model.classes_
        
        results = []
        top_indices = probs.argsort()[-3:][::-1]
        
        for i in top_indices:
            results.append({
                "crop": str(crops[i]),
                "confidence": float(probs[i]),
                "yield": 3.5, # Placeholder yield engine
                "price": 22000, # Placeholder price engine
                "profit": (3.5 * 22000) - 15000,
                "roi": (((3.5 * 22000) - 15000) / 15000) * 100,
                "risk": "Low" if float(probs[i]) > 0.6 else "Medium"
            })
        return results

prediction_service = PredictionService()
