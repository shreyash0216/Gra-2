# GRA: Generative Resilience Agent 🌾

GRA is an advanced climate adaptation planner that combines **Machine Learning (RandomForest)** with **Generative AI (Gemini)** to provide hyper-local agricultural strategies and crop recommendations for Indian farmers.

---

## 🏗 Project Structure

```text
GRA/
├── frontend/             # React + Vite + TypeScript (UI Layer)
├── backend/              # FastAPI Application (Logic Layer)
├── dataset/              # Raw Agricultural & Rainfall Data (CSV)
├── models/               # Trained ML Models (.pkl)
├── scripts/              # Training & Data Pipelines
└── docs/                 # Architecture Documentation
```

---

## 🛠 Prerequisites

Ensure you have the following installed:
- **Python 3.9 or higher**
- **Node.js 18 or higher**
- **npm (Node Package Manager)**

---

## 🚀 Setup & Installation

### 1. Backend Setup

#### **Windows**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### **macOS / Linux**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Frontend Setup
Available on all platforms:
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env` file inside the `frontend/` directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🏃‍♂️ Running the Project

To run the full system, you need to open two terminal windows (one for Backend, one for Frontend).

### Step 1: Start the Backend (FastAPI)
**Note:** Ensure your virtual environment is activated.

#### **Windows / Mac / Linux**
```bash
cd backend
# Recommended run command
python -m uvicorn app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### Step 2: Start the Frontend (Vite)

#### **Windows / Mac / Linux**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🧠 Training the Model (Optional)

If you modify the datasets in `/dataset` and want to retrain the brain:

#### **Windows**
```bash
cd scripts
python train.py
```

#### **macOS / Linux**
```bash
cd scripts
python3 train.py
```
This script will engineering new features and save a fresh `crop_model.pkl` into the `/models` directory.

---

## 📜 Architecture Summary

1.  **ML Layer**: A RandomForest model with 99%+ accuracy analyzes NPK, pH, temperature, and rainfall to predict the best crops.
2.  **Logic Layer**: FastAPI processes requests and calculates real-time Profit and ROI metrics.
3.  **Explanation Layer**: Gemini 1.5 Flash provides a human-readable explanation for why the ML chose a particular recommendation.
4.  **UI Layer**: A premium React dashboard provides a stunning visualization of the adaptation plan.

---

## ⚖️ License
Team COSMOS (AWS ImpactX Challenge)
