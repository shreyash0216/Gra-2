from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import sys

# Ensure script can find data_pipeline.py in the same folder
sys.path.append(os.path.dirname(__file__))
from data_pipeline import load_datasets, clean_crop_data, merge_datasets, feature_engineering

def train():
    print("🚀 Starting Production ML Pipeline [XGBoost/RF]...")
    
    # 1. Load
    crop, rainfall, agri = load_datasets()

    # 2. Clean
    crop = clean_crop_data(crop)

    # 3. Features
    df = feature_engineering(crop)

    # 4. Prepare
    X = df.drop(["label"], axis=1)
    y = df["label"]

    # 5. Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 6. Model
    model = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42)
    model.fit(X_train, y_train)

    # 7. Evaluate
    preds = model.predict(X_test)
    print(f"\n✅ Model Training Complete. Accuracy: {accuracy_score(y_test, preds)*100:.2f}%")
    print(classification_report(y_test, preds))

    # 8. Save Artifact to GRA/models/
    model_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "crop_model.pkl")
    
    joblib.dump(model, model_path)
    print(f"💾 Model artifact saved to: {model_path}")

if __name__ == "__main__":
    train()
