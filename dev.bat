@echo off
REM GRA Local Development Quick Start Script for Windows

setlocal enabledelayedexpansion

echo.
echo 🌾 GRA - Generative Resilience Agent - Local Setup (Windows)
echo ===================================================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18+
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check for Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python 3.11+
    echo Download from: https://www.python.org/
    pause
    exit /b 1
)

echo ✅ All requirements met

REM Setup backend
echo.
echo 📦 Setting up Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -q -r requirements.txt

cd ..
echo ✅ Backend setup complete

REM Setup frontend
echo.
echo 📦 Setting up Frontend...
cd frontend

echo Installing dependencies...
call npm ci --quiet

cd ..
echo ✅ Frontend setup complete

REM Create .env if not exists
echo.
echo 🔑 Checking environment variables...

if not exist ".env" (
    echo ⚠️  .env file not found
    set /p api_key="Enter your Google Generative AI API Key (or press Enter to skip): "
    
    if not "!api_key!"=="" (
        (
            echo GOOGLE_API_KEY=!api_key!
        ) > .env
        echo ✅ .env file created
    ) else (
        echo ⚠️  Skipping API key setup. Chat features won't work.
    )
) else (
    echo ✅ .env file found
)

REM Start services
echo.
echo 🚀 Starting services...
echo.
echo Opening two terminals:
echo   - Backend on http://localhost:8000
echo   - Frontend on http://localhost:3000
echo.
echo Press Ctrl+C in any terminal to stop
echo.

REM Start backend in new window
cd backend
call venv\Scripts\activate.bat
start "GRA Backend" cmd /k python -m uvicorn app.main:app --reload
cd ..

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start frontend in new window
cd frontend
start "GRA Frontend" cmd /k npm run dev
cd ..

echo ✅ Services started! Check the new terminal windows.
echo.
pause
