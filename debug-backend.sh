#!/bin/bash
# Debug script to test GRA backend connectivity

echo "🔍 GRA Backend Connectivity Debug"
echo "=================================="
echo ""

# Check if backend is running
echo "1️⃣  Checking if backend is running on port 8000..."
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend is running!"
    
    # Test health endpoint
    echo ""
    echo "2️⃣  Testing health endpoint..."
    HEALTH=$(curl -s http://localhost:8000/)
    echo "Response: $HEALTH"
else
    echo "❌ Backend is NOT running!"
    echo ""
    echo "To start the backend:"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  export GOOGLE_API_KEY=your_api_key"
    echo "  python -m uvicorn app.main:app --reload"
    exit 1
fi

# Check if Google API key is set
echo ""
echo "3️⃣  Checking Google API key..."
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "⚠️  GOOGLE_API_KEY environment variable not set"
    echo "Set it with: export GOOGLE_API_KEY=your_key"
else
    echo "✅ GOOGLE_API_KEY is set"
fi

# Test prediction endpoint
echo ""
echo "4️⃣  Testing prediction endpoint..."
PREDICT=$(curl -s -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "N": 90,
    "P": 40,
    "K": 40,
    "temperature": 25,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
  }')

if echo "$PREDICT" | grep -q "error\|Error"; then
    echo "❌ Prediction endpoint failed:"
    echo "$PREDICT"
else
    echo "✅ Prediction endpoint works:"
    echo "$PREDICT" | head -c 200
    echo "..."
fi

# Test chat endpoint (if API key is set)
echo ""
echo "5️⃣  Testing chat endpoint..."
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "⚠️  Skipping chat test (GOOGLE_API_KEY not set)"
else
    CHAT=$(curl -s -X POST http://localhost:8000/chat \
      -H "Content-Type: application/json" \
      -d '{"user_input":"Hello"}')
    
    if echo "$CHAT" | grep -q "error\|Error"; then
        echo "❌ Chat endpoint failed:"
        echo "$CHAT"
    else
        echo "✅ Chat endpoint works"
        echo "$CHAT" | head -c 200
        echo "..."
    fi
fi

echo ""
echo "✅ Debug complete!"
echo ""
echo "If all tests passed, try refreshing your browser."
echo "If tests failed, check the backend logs."
