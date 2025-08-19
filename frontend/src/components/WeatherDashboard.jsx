// FILE: frontend/src/components/WeatherDashboard.jsx  
// Weather dashboard with live data integration and blockchain weather controls

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, CloudDrizzle, RefreshCw, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';

const WeatherDashboard = ({ blockchain, userBalance }) => {
  const [realWeatherData, setRealWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [manualUpdateLoading, setManualUpdateLoading] = useState(false);

  // Fetch real weather data from API
  const fetchRealWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
      if (!API_KEY) {
        console.warn('⚠️ OpenWeather API key not found');
        return;
      }

      // Using Kuliyapitiya, LK coordinates
      const lat = 7.4675;
      const lon = 80.0396;
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const data = await response.json();
      setRealWeatherData(data);
      setLastUpdate(new Date());
      console.log('🌤️ Real weather data fetched:', data);
    } catch (error) {
      console.error('❌ Failed to fetch weather data:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Initial weather fetch
  useEffect(() => {
    fetchRealWeatherData();
  }, []);

  // Weather sync for gameplay mechanics
  const handleWeatherSync = async (weatherType) => {
    if (!blockchain.isConnected) {
      alert('🔗 Please connect your wallet first!');
      return;
    }

    setManualUpdateLoading(true);
    try {
      console.log('🌦️ Syncing weather conditions to:', weatherType);
      await blockchain.updateWeather(weatherType);
      console.log('✅ Weather conditions updated successfully');
    } catch (error) {
      console.error('❌ Failed to sync weather:', error);
      alert('❌ Weather sync failed: ' + error.message);
    } finally {
      setManualUpdateLoading(false);
    }
  };

  // Refresh weather data
  const handleRefreshWeatherData = async () => {
    await fetchRealWeatherData();
  };

  // Get weather icon based on current conditions
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'Storm': return <Cloud className="w-8 h-8 text-purple-400" />;
      case 'Rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'Snow': return <Snowflake className="w-8 h-8 text-cyan-400" />;
      case 'Fog': return <CloudDrizzle className="w-8 h-8 text-gray-400" />;
      default: return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  // Get weather gradient colors
  const getWeatherGradient = (weather) => {
    switch (weather) {
      case 'Storm': return 'from-purple-500 to-indigo-600';
      case 'Rain': return 'from-blue-500 to-cyan-600';
      case 'Snow': return 'from-cyan-400 to-blue-500';
      case 'Fog': return 'from-gray-500 to-slate-600';
      default: return 'from-yellow-400 to-orange-500';
    }
  };

  // Format last update time
  const formatLastUpdate = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Live Weather Data Card */}
      <div className={`glass-effect rounded-xl p-6 bg-gradient-to-br ${getWeatherGradient(blockchain.currentWeather)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(blockchain.currentWeather)}
            <div>
              <h2 className="text-2xl font-bold text-white">{blockchain.currentWeather}</h2>
              <p className="text-white/80 text-sm">Active Weather Conditions</p>
            </div>
          </div>
          <button
            onClick={handleRefreshWeatherData}
            disabled={weatherLoading}
            className="bg-white/20 hover:bg-white/30 disabled:opacity-50 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 text-white ${weatherLoading ? 'animate-spin' : ''}`} />
            <span className="text-white text-sm">Refresh</span>
          </button>
        </div>

        {/* Real Weather Data Display */}
        {realWeatherData ? (
          <>
            <div className="flex items-center space-x-2 mb-4 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                {realWeatherData.name}, {realWeatherData.sys?.country || 'LK'}
              </span>
              <span className="bg-green-500/30 text-green-200 text-xs px-2 py-1 rounded-full">
                LIVE DATA
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <Thermometer className="w-6 h-6 text-white/70 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Math.round(realWeatherData.main?.temp || 0)}°
                </div>
                <div className="text-xs text-white/70">Temperature</div>
              </div>
              
              <div className="text-center">
                <Droplets className="w-6 h-6 text-white/70 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {realWeatherData.main?.humidity || 0}%
                </div>
                <div className="text-xs text-white/70">Humidity</div>
              </div>
              
              <div className="text-center">
                <Wind className="w-6 h-6 text-white/70 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {(realWeatherData.wind?.speed || 0).toFixed(1)}m/s
                </div>
                <div className="text-xs text-white/70">Wind Speed</div>
              </div>
              
              <div className="text-center">
                <Eye className="w-6 h-6 text-white/70 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Math.round((realWeatherData.visibility || 10000) / 1000)}/5
                </div>
                <div className="text-xs text-white/70">Intensity</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-white/70 mb-2">Loading weather data...</div>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {/* Weather System Status */}
        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium mb-1">🌦️ Weather System</h4>
              <p className="text-white/80 text-sm">
                Current Conditions: <strong>{blockchain.currentWeather}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm">Weather Sync:</div>
              <div className="text-green-400 font-medium text-sm">Active</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-white/60">
            <span>⏰ Last updated: {formatLastUpdate(lastUpdate)}</span>
            <span>🔄 Manual refresh available</span>
          </div>
        </div>
      </div>

      {/* Weather Control Panel */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-blue-400" />
          <span>Weather Control Panel</span>
          {manualUpdateLoading && (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </h3>

        <p className="text-gray-300 text-sm mb-4">
          Adjust weather conditions for different gameplay experiences. Requires wallet connection.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 0, name: 'Storm', icon: Cloud, color: 'purple' },
            { id: 1, name: 'Sunshine', icon: Sun, color: 'yellow' },
            { id: 2, name: 'Fog', icon: CloudDrizzle, color: 'gray' },
            { id: 3, name: 'Rain', icon: CloudRain, color: 'blue' },
            { id: 4, name: 'Snow', icon: Snowflake, color: 'cyan' }
          ].map((weather) => {
            const IconComponent = weather.icon;
            const isActive = blockchain.currentWeather === weather.name;
            
            return (
              <button
                key={weather.id}
                onClick={() => handleWeatherSync(weather.id)}
                disabled={manualUpdateLoading || isActive || !blockchain.isConnected}
                className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center space-y-2 ${
                  isActive
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : manualUpdateLoading || !blockchain.isConnected
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    : weather.color === 'purple'
                    ? 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 cursor-pointer'
                    : weather.color === 'yellow'
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-400 cursor-pointer'
                    : weather.color === 'gray'
                    ? 'bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 text-gray-400 cursor-pointer'
                    : weather.color === 'blue'
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 cursor-pointer'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 cursor-pointer'
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs font-medium">{weather.name}</span>
                {isActive && (
                  <span className="text-xs text-green-400">Active</span>
                )}
              </button>
            );
          })}
        </div>

        {!blockchain.isConnected && (
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ Connect your wallet to use weather controls
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-400 text-sm">
            💡 Transaction cost: ~0.00015 STT • Optimized gas: 15 gwei • Balance: {userBalance.toFixed(6)} STT
          </p>
        </div>
      </div>

      {/* Weather Effects Guide */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Weather Effects on Gameplay</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-purple-500/20 rounded-lg">
            <Cloud className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-white font-medium">Storm</div>
              <div className="text-gray-300 text-sm">High-intensity challenges • Lightning mechanics</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-500/20 rounded-lg">
            <Sun className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-white font-medium">Sunshine</div>
              <div className="text-gray-300 text-sm">Exploration mode • Solar energy systems</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-500/20 rounded-lg">
            <CloudRain className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-white font-medium">Rain</div>
              <div className="text-gray-300 text-sm">Resource boost • Water mechanics</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-cyan-500/20 rounded-lg">
            <Snowflake className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-white font-medium">Snow</div>
              <div className="text-gray-300 text-sm">Survival mode • Cold resistance required</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-500/20 rounded-lg">
            <CloudDrizzle className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-white font-medium">Fog</div>
              <div className="text-gray-300 text-sm">Stealth mechanics • Hidden discovery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;