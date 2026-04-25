# 🚀 Quick Start Guide

Get the GRA (Generative Resilience Agent) running locally in minutes.

## Fastest Way to Start (Recommended)

### On macOS/Linux:
```bash
chmod +x dev.sh
./dev.sh
```

### On Windows:
```bash
dev.bat
```

This will automatically:
1. ✅ Check system requirements
2. ✅ Create Python virtual environment
3. ✅ Install dependencies (backend & frontend)
4. ✅ Set up Google API key
5. ✅ Start both services

Then open: **http://localhost:3000**

---

## Alternative: Docker Compose

```bash
export GOOGLE_API_KEY=your_api_key_here
docker-compose up --build
```

Open: **http://localhost:3000**

---

## Manual Setup

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for detailed step-by-step instructions.

---

## What's Running

- **Frontend**: React + Vite on http://localhost:3000
- **Backend**: FastAPI on http://localhost:8000
- **API Proxy**: Vite dev server proxies `/api/*` to backend

---

## Troubleshooting

**Port already in use?**
```bash
# macOS/Linux - kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**API not connecting?**
- Backend running? Check http://localhost:8000
- CORS enabled for localhost? Check `backend/app/main.py`
- Google API key set? Check `.env` file

**See [LOCAL_SETUP.md](LOCAL_SETUP.md) for more troubleshooting help**

---

## Production Deployment

- **Frontend**: AWS Amplify
- **Backend**: AWS App Runner
- **Config**: See `amplify.yml`

---

**Happy farming with GRA! 🌾**
