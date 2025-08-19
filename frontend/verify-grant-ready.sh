#!/bin/bash

echo "� GRANT READINESS VERIFICATION"
echo "================================"

# Check 1: Contract files
echo "� Checking contract files..."
if [ -f "contracts/EnhancedWeatherOracle.sol" ]; then
    echo "✅ EnhancedWeatherOracle.sol exists"
else
    echo "❌ Missing EnhancedWeatherOracle.sol"
fi

if [ -f "contracts/WeatherToken.sol" ]; then
    echo "✅ WeatherToken.sol exists"
else
    echo "❌ Missing WeatherToken.sol"
fi

# Check 2: Deployment
echo -e "\n� Checking deployment..."
if [ -f "deployed-addresses.json" ]; then
    echo "✅ Contracts deployed (deployed-addresses.json exists)"
    echo "Contract addresses:"
    cat deployed-addresses.json | grep -E "(weatherOracle|weatherToken)" | head -2
else
    echo "❌ No deployment found"
fi

# Check 3: Frontend
echo -e "\n� Checking frontend..."
if [ -f "frontend/src/App.jsx" ]; then
    echo "✅ Frontend files exist"
else
    echo "❌ Missing frontend files"
fi

# Check 4: Dependencies
echo -e "\n� Checking dependencies..."
if npm list @openzeppelin/contracts > /dev/null 2>&1; then
    echo "✅ OpenZeppelin contracts installed"
else
    echo "❌ Missing OpenZeppelin contracts"
fi

echo -e "\n� VERIFICATION COMPLETE!"
echo "If all items show ✅, you're ready for grant submission!"
