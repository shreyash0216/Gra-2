#!/bin/bash

# GRA Local Development Quick Start Script
# Run this script from the project root to start both frontend and backend

set -e

echo "🌾 GRA - Generative Resilience Agent - Local Setup"
echo "=================================================="

# Check for required tools
check_requirements() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 not found. Please install Python 3.11+"
        exit 1
    fi
    
    echo "✅ All requirements met"
}

# Setup backend
setup_backend() {
    echo ""
    echo "📦 Setting up Backend..."
    cd backend
    
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    echo "Activating virtual environment..."
    source venv/bin/activate
    
    echo "Installing dependencies..."
    pip install -q -r requirements.txt
    
    cd ..
    echo "✅ Backend setup complete"
}

# Setup frontend
setup_frontend() {
    echo ""
    echo "📦 Setting up Frontend..."
    cd frontend
    
    echo "Installing dependencies..."
    npm ci --quiet
    
    cd ..
    echo "✅ Frontend setup complete"
}

# Create .env if not exists
setup_env() {
    echo ""
    echo "🔑 Checking environment variables..."
    
    if [ ! -f ".env" ]; then
        echo "⚠️  .env file not found"
        echo "Please create .env file with: GOOGLE_API_KEY=your_api_key"
        read -p "Enter your Google Generative AI API Key (or press Enter to skip): " api_key
        
        if [ -n "$api_key" ]; then
            echo "GOOGLE_API_KEY=$api_key" > .env
            echo "✅ .env file created"
        else
            echo "⚠️  Skipping API key setup. Chat features won't work."
        fi
    else
        echo "✅ .env file found"
    fi
}

# Start services
start_services() {
    echo ""
    echo "🚀 Starting services..."
    echo ""
    echo "Opening in 3 terminals:"
    echo "  - Backend on http://localhost:8000"
    echo "  - Frontend on http://localhost:3000"
    echo ""
    echo "Press Ctrl+C in any terminal to stop"
    echo ""
    
    # Start backend in background
    (cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload) &
    BACKEND_PID=$!
    
    sleep 2
    
    # Start frontend
    (cd frontend && npm run dev)
    
    # Cleanup on exit
    trap "kill $BACKEND_PID" EXIT
}

# Main execution
main() {
    check_requirements
    setup_env
    setup_backend
    setup_frontend
    start_services
}

main
