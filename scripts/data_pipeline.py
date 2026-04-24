import pandas as pd
import os

def load_datasets():
    # Points to GRA/dataset/ from GRA/scripts/
    base_path = os.path.join(os.path.dirname(__file__), "..", "dataset")
    
    crop = pd.read_csv(os.path.join(base_path, "Crop_recommendation.csv"))
    rainfall = pd.read_csv(os.path.join(base_path, "Rainfall_Data_LL.csv"))
    agri = pd.read_csv(os.path.join(base_path, "agricultural_data_india.csv"))

    # Normalize column names
    name_map = {
        'Nitrogen': 'N', 'phosphorus': 'P', 'potassium': 'K',
        'nitrogen': 'N', 'Phosphorus': 'P', 'Potassium': 'K'
    }
    crop = crop.rename(columns=name_map)

    return crop, rainfall, agri

def clean_crop_data(df):
    df = df.dropna(subset=['label'])
    if 'rainfall' in df.columns:
        df = df[df['rainfall'] > 0]
    return df

def merge_datasets(crop, rainfall):
    return crop

def feature_engineering(df):
    required_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        print(f"Warning: Missing columns {missing}. Engineering skipped.")
        return df

    df["temp_humidity"] = df["temperature"] * df["humidity"]
    df["npk_ratio"] = df["N"] / (df["P"] + df["K"] + 1)
    df["soil_score"] = df["ph"] * df["N"]
    df["climate_index"] = df["temperature"] * df["rainfall"]
    df["water_availability"] = df["rainfall"] / (df["temperature"] + 1)
    
    for col in required_cols + ["temp_humidity", "npk_ratio", "soil_score", "climate_index", "water_availability"]:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    df = df.fillna(df.mean(numeric_only=True))
    return df
