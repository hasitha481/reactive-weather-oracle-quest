#!/bin/bash

echo "í¾¯ GRANT READINESS VERIFICATION"
echo "================================"

# Check 1: Contract files
echo "í³„ Checking contract files..."
if [ -f "contracts/EnhancedWeatherOracle.sol" ]; then
    echo "âœ… EnhancedWeatherOracle.sol exists"
else
    echo "âŒ Missing EnhancedWeatherOracle.sol"
fi

if [ -f "contracts/WeatherToken.sol" ]; then
    echo "âœ… WeatherToken.sol exists"
else
    echo "âŒ Missing WeatherToken.sol"
fi

# Check 2: Deployment
echo -e "\níº€ Checking deployment..."
if [ -f "deployed-addresses.json" ]; then
    echo "âœ… Contracts deployed (deployed-addresses.json exists)"
    echo "Contract addresses:"
    cat deployed-addresses.json | grep -E "(weatherOracle|weatherToken)" | head -2
else
    echo "âŒ No deployment found"
fi

# Check 3: Frontend
echo -e "\ní¾¨ Checking frontend..."
if [ -f "frontend/src/App.jsx" ]; then
    echo "âœ… Frontend files exist"
else
    echo "âŒ Missing frontend files"
fi

# Check 4: Dependencies
echo -e "\ní³¦ Checking dependencies..."
if npm list @openzeppelin/contracts > /dev/null 2>&1; then
    echo "âœ… OpenZeppelin contracts installed"
else
    echo "âŒ Missing OpenZeppelin contracts"
fi

echo -e "\ní¾‰ VERIFICATION COMPLETE!"
echo "If all items show âœ…, you're ready for grant submission!"
