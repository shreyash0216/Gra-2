# GRA Architecture Overview

## Project Structure
- **/frontend**: React + Vite + TypeScript. Clean separation of services, components, and types.
- **/backend**: FastAPI microservice. Domain-driven design with a service layer for ML inference.
- **/dataset**: Raw data source of truth (CSV format).
- **/models**: Serialized ML artifacts (.pkl) ready for production deployment.
- **/scripts**: Standalone data pipelines and training orchestrators.

## Integration Flow
1. **Frontend** captures village data.
2. **Backend/predict** receives JSON, engineers features, and queries the **RandomForest** model.
3. **Gemini Engine** provides an unstructured "explanation layer" to convert data metrics into human insights.

## How to Run

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python -m app.main` (or `uvicorn app.main:app --reload`)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
