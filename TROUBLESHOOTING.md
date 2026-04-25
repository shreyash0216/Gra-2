# 🔧 Troubleshooting Backend Connection Issues

If you're seeing "Backend connection failed" errors, follow this guide.

## Quick Diagnosis

Run the debug script:
```bash
chmod +x debug-backend.sh
./debug-backend.sh
```

This will check:
1. ✅ Backend running on port 8000
2. ✅ Health endpoint responding
3. ✅ GOOGLE_API_KEY set
4. ✅ Prediction endpoint working
5. ✅ Chat endpoint working

---

## Common Issues & Solutions

### Issue 1: Backend Not Running

**Error:** ❌ Backend is NOT running!

**Solution:**

```bash
# Option A: Use dev.sh (automatic)
./dev.sh

# Option B: Manual setup
cd backend
source venv/bin/activate
export GOOGLE_API_KEY=your_key_here
python -m uvicorn app.main:app --reload
```

**Verify:** Open http://localhost:8000 in browser - should see:
```json
{"status":"operational","version":"1.0.0"}
```

---

### Issue 2: GOOGLE_API_KEY Not Set

**Error:** Backend returns 403 or API errors

**Solution:**

```bash
# Get your key: https://aistudio.google.com/app/apikeys

# Option A: Set environment variable (temporary)
export GOOGLE_API_KEY=your_actual_key

# Option B: Set in .env file (persistent)
echo "GOOGLE_API_KEY=your_actual_key" > .env
source .env

# Verify it's set
echo $GOOGLE_API_KEY
```

---

### Issue 3: Port 8000 Already in Use

**Error:** "Address already in use" or "OSError: [Errno 48]"

**Find & Kill Process:**

```bash
# macOS/Linux - show process on port 8000
lsof -i :8000

# Kill it
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Use Different Port:**

```bash
python -m uvicorn app.main:app --port 8001 --reload
# Then update frontend to use :8001
```

---

### Issue 4: Frontend Can't Reach Backend

**Error in Browser Console:**
```
Backend connection failed. Is your FastAPI server running on port 8000?
```

**Checklist:**
1. ✅ Backend running: `curl http://localhost:8000/`
2. ✅ Frontend running: Open http://localhost:3000
3. ✅ Check browser DevTools (F12) → Network tab
   - Look for `/api/chat` or `/api/predict` requests
   - Check the Response tab for error details
4. ✅ Check CORS configuration in `backend/app/main.py`
   - Should include `http://localhost:3000`

**Fix CORS if needed:**
```python
# backend/app/main.py
allow_origins=[
    "http://localhost:3000",      # Add this
    "http://127.0.0.1:3000",      # Add this
    "http://localhost:5173",       # Vite default
    # ... other origins
]
```

---

### Issue 5: Prediction Returns Empty or Error

**Error:** `{"error":"Model not found"}` or no recommendations

**Checklist:**
1. ✅ Model file exists: `backend/models/crop_model.pkl`
2. ✅ Backend path is correct in `prediction_service.py`
3. ✅ Virtual environment has scikit-learn: `pip install scikit-learn`

**Test Prediction Directly:**

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

Expected response:
```json
{
  "recommendations": [
    {
      "crop": "rice",
      "confidence": 0.85,
      "yield": 3.5,
      "price": 22000,
      "profit": 62000,
      "roi": 413.33,
      "risk": "Low"
    }
  ]
}
```

---

### Issue 6: Chat Returns Error

**Error:** `Invalid response format` or empty reply

**Checklist:**
1. ✅ GOOGLE_API_KEY set: `echo $GOOGLE_API_KEY`
2. ✅ geminiService.ts path is correct
3. ✅ Backend `/chat` endpoint exists

**Test Chat Directly:**

```bash
export GOOGLE_API_KEY=your_key
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"user_input":"What crops grow well in tropical climate?"}'
```

Expected response:
```json
{
  "reply": "Rice, coconut, and banana are well-suited for tropical climates..."
}
```

---

## Debugging with Browser DevTools

### Check Network Requests:

1. Open browser: F12 → Network tab
2. Enter a message in chat
3. Look for request to `/api/chat` or `/api/predict`
4. **Click the request** and check:
   - **Headers**: Content-Type should be `application/json`
   - **Request Body**: Shows your input
   - **Response**: Shows backend reply
   - **Status**: Should be 200, not 4xx or 5xx

### Check Console Errors:

1. Open browser: F12 → Console tab
2. Look for errors in red
3. Common errors:
   - `CORS error` → Check backend allow_origins
   - `Failed to fetch` → Backend not running
   - `Invalid JSON` → Backend response malformed
   - `Missing "reply" field` → Response format wrong

### View Detailed Logs:

```bash
# Backend logs (in backend terminal)
# Should show:
# INFO:     Application startup complete
# INFO:     POST /predict
# INFO:     POST /chat

# Frontend logs (in browser DevTools)
# Should show:
# 📤 Sending chat request: ...
# 📥 Response status: 200
# ✅ Response data: {...}
```

---

## Step-by-Step Recovery

If everything is broken, follow this:

```bash
# 1. Kill all processes
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# 2. Clear frontend cache
cd frontend
rm -rf node_modules
npm ci

# 3. Reinstall backend deps
cd ../backend
source venv/bin/activate
pip install -r requirements.txt

# 4. Start backend
export GOOGLE_API_KEY=your_key
python -m uvicorn app.main:app --reload

# 5. Start frontend (in new terminal)
cd frontend
npm run dev

# 6. Test
open http://localhost:3000
```

---

## Getting Help

**Provide these details when asking for help:**
1. Output of `./debug-backend.sh`
2. Browser DevTools Console errors (F12)
3. Backend terminal output
4. Frontend terminal output
5. Your OS (macOS/Linux/Windows)

---

**Still stuck? Check LOCAL_SETUP.md for detailed setup instructions.** 🌾
