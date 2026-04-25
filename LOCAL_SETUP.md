# 🚀 Local Development Setup Guide

Complete guide to run the GRA (Generative Resilience Agent) application locally on your PC.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/))
- **Docker & Docker Compose** (Optional, for containerized setup)
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikeys))

---

## Option 1: Manual Setup (Recommended for Development)

### Step 1: Clone the Repository

```bash
cd /path/to/your/workspace
# Repository should already be cloned
cd Gra-2
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cat > .env << 'EOF'
GOOGLE_API_KEY=your_actual_api_key_here
EOF
```

Replace `your_actual_api_key_here` with your actual Google Generative AI key.

### Step 3: Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will run at: **http://localhost:8000**

**Test it:**
```bash
curl http://localhost:8000/
# Should return: {"status":"operational","version":"1.0.0"}
```

### Step 4: Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
npm ci

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

## Option 2: Docker Compose Setup (For Isolated Environment)

### Prerequisites

- Docker and Docker Compose installed

### Step 1: Set Environment Variables

```bash
# In project root
export GOOGLE_API_KEY=your_actual_api_key_here
```

### Step 2: Start Services

```bash
# From project root
docker-compose up --build
```

This will:
- Build and start the backend on `http://localhost:8000`
- Build and start the frontend on `http://localhost:3000`
- Services communicate via the `gra-network` bridge network

### Step 3: View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Step 4: Stop Services

```bash
docker-compose down
```

---

## Testing the Application

### 1. Check Backend Health

```bash
curl http://localhost:8000/
```

Expected response:
```json
{"status":"operational","version":"1.0.0"}
```

### 2. Test Crop Prediction API

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "N": 90,
    "P": 40,
    "K": 40,
    "temperature": 25,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
  }'
```

### 3. Test Chat API

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"user_input":"What crops grow well in tropical climate?"}'
```

### 4. Access Frontend

Open browser to: **http://localhost:3000**

---

## Debugging & Common Issues

### Issue: "GOOGLE_API_KEY not found"

**Solution:**
```bash
# Make sure to export the environment variable
export GOOGLE_API_KEY=your_key_here

# Or set it in .env in the project root
echo "GOOGLE_API_KEY=your_key_here" > .env
```

### Issue: Port 3000 or 8000 Already in Use

**Check what's using the port:**
```bash
# macOS/Linux
lsof -i :3000
lsof -i :8000

# Windows
netstat -ano | findstr :3000
```

**Kill the process or use different ports:**
```bash
# For frontend (in frontend dir)
npm run dev -- --port 3001

# For backend
python -m uvicorn app.main:app --port 8001
```

### Issue: CORS Errors

The backend CORS is configured for:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:5173` (Vite dev server fallback)
- Production URLs

If you use different ports, add them to [backend/app/main.py](../backend/app/main.py) in the `allow_origins` list.

### Issue: Backend not connecting to Frontend

**Debug steps:**
1. Verify backend is running: `curl http://localhost:8000/`
2. Check browser console (F12) for network errors
3. Verify API calls in Network tab
4. Check CORS settings in backend/app/main.py

---

## Project Structure

```
Gra-2/
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   └── types.ts          # TypeScript types
│   ├── package.json
│   ├── vite.config.ts        # Dev server config with API proxy
│   ├── .env.local            # Local environment variables
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app & routes
│   │   └── services/         # Business logic
│   ├── requirements.txt
│   ├── venv/                 # Virtual environment
│   └── Dockerfile
├── docker-compose.yml        # Container orchestration
└── .env                       # Root environment variables
```

---

## API Endpoints (Local Development)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `http://localhost:8000/` | Health check |
| POST | `http://localhost:8000/predict` | Crop prediction |
| POST | `http://localhost:8000/chat` | AI chat with Gemini |
| GET | `http://localhost:8000/market-prices` | Market data |

---

## Frontend Commands

```bash
cd frontend

# Development mode with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking (if configured)
npm run type-check
```

---

## Backend Commands

```bash
cd backend

# Activate venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt

# Run with auto-reload (development)
python -m uvicorn app.main:app --reload

# Run with specific port
python -m uvicorn app.main:app --port 8001

# Run in production mode (no reload)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## CI/CD & Deployment

- **Production Frontend**: Deployed to AWS Amplify
- **Production Backend**: Deployed to AWS App Runner
- **Amplify Config**: See [amplify.yml](../amplify.yml)

---

## Performance Tips

1. **Use Docker Compose** for isolated, consistent environment
2. **Enable Python virtual environment** to avoid conflicts
3. **Clear npm cache** if issues: `npm cache clean --force`
4. **Rebuild node_modules** if needed: `rm -rf node_modules && npm ci`
5. **Check API response times** in browser DevTools Network tab

---

## Need Help?

- Check backend logs: `python -m uvicorn app.main:app --reload` (watch console)
- Check frontend logs: Browser DevTools Console (F12)
- Check Docker logs: `docker-compose logs -f`
- Verify API: Use curl or Postman to test endpoints directly

---

**Happy developing! 🌾**
