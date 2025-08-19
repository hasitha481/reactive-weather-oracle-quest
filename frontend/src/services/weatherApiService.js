// FILE: frontend/src/services/weatherApiService.js
// Complete Weather API Service with proper weather type mapping

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || 'your_api_key_here';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather type constants that match your contract configuration
export const WEATHER_TYPES = {
  STORM: 0,
  SUNSHINE: 1, 
  FOG: 2,
  RAIN: 3,
  SNOW: 4
};

// Weather condition mapping from OpenWeatherMap to our game
const WEATHER_MAPPING = {
  // Thunderstorm conditions
  200: 'Storm', 201: 'Storm', 202: 'Storm', 210: 'Storm', 211: 'Storm', 
  212: 'Storm', 221: 'Storm', 230: 'Storm', 231: 'Storm', 232: 'Storm',
  
  // Drizzle and Rain conditions  
  300: 'Rain', 301: 'Rain', 302: 'Rain', 310: 'Rain', 311: 'Rain',
  312: 'Rain', 313: 'Rain', 314: 'Rain', 321: 'Rain', 500: 'Rain',
  501: 'Rain', 502: 'Rain', 503: 'Rain', 504: 'Rain', 511: 'Rain',
  520: 'Rain', 521: 'Rain', 522: 'Rain', 531: 'Rain',
  
  // Snow conditions
  600: 'Snow', 601: 'Snow', 602: 'Snow', 611: 'Snow', 612: 'Snow',
  613: 'Snow', 615: 'Snow', 616: 'Snow', 620: 'Snow', 621: 'Snow', 622: 'Snow',
  
  // Atmosphere conditions (Fog, Mist, etc.)
  701: 'Fog', 711: 'Fog', 721: 'Fog', 731: 'Fog', 741: 'Fog', 751: 'Fog',
  761: 'Fog', 762: 'Fog', 771: 'Fog', 781: 'Fog',
  
  // Clear and Clouds (Sunshine)
  800: 'Sunshine', 801: 'Sunshine', 802: 'Sunshine', 803: 'Sunshine', 804: 'Sunshine'
};

// Default locations for testing (can be user's location later)
const DEFAULT_LOCATIONS = [
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 }
];

class WeatherApiService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
    this.currentLocation = DEFAULT_LOCATIONS[0]; // Start with New York
  }

  // Get current weather from OpenWeatherMap API
  async getCurrentWeather(lat = null, lon = null) {
    try {
      // Use provided coordinates or default location
      const location = lat && lon ? { lat, lon } : this.currentLocation;
      const cacheKey = `${location.lat},${location.lon}`;
      
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('🎯 Using cached weather data');
        return cached.data;
      }

      // Fetch from OpenWeatherMap API
      const url = `${OPENWEATHER_BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      
      console.log('🌐 Fetching real weather data from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform to our game format
      const gameWeather = this.transformWeatherData(data);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: gameWeather,
        timestamp: Date.now()
      });

      console.log('✅ Real weather data fetched:', gameWeather);
      return gameWeather;

    } catch (error) {
      console.error('❌ Weather API Error:', error);
      // Fallback to random weather if API fails
      return this.getFallbackWeather();
    }
  }

  // Transform OpenWeatherMap data to our game format
  transformWeatherData(apiData) {
    const weatherId = apiData.weather[0].id;
    const gameWeatherType = WEATHER_MAPPING[weatherId] || 'Sunshine';
    
    return {
      type: gameWeatherType,
      typeId: this.getWeatherTypeId(gameWeatherType),
      intensity: this.calculateIntensity(apiData),
      temperature: Math.round(apiData.main.temp),
      humidity: apiData.main.humidity,
      windSpeed: apiData.wind?.speed || 0,
      description: apiData.weather[0].description,
      location: apiData.name,
      country: apiData.sys.country,
      timestamp: Date.now(),
      isRealData: true,
      apiWeatherId: weatherId
    };
  }

  // Convert weather type string to ID for smart contract
  getWeatherTypeId(weatherType) {
    const typeMap = { 'Storm': 0, 'Sunshine': 1, 'Fog': 2, 'Rain': 3, 'Snow': 4 };
    return typeMap[weatherType] || 1;
  }

  // Calculate weather intensity based on various factors
  calculateIntensity(apiData) {
    let intensity = 1; // Base intensity
    
    // Factor in wind speed
    const windSpeed = apiData.wind?.speed || 0;
    if (windSpeed > 10) intensity += 1;
    if (windSpeed > 20) intensity += 1;
    
    // Factor in rain/snow
    const rain = apiData.rain?.['1h'] || 0;
    const snow = apiData.snow?.['1h'] || 0;
    if (rain > 1 || snow > 1) intensity += 1;
    if (rain > 5 || snow > 5) intensity += 1;
    
    // Factor in visibility for fog
    const visibility = apiData.visibility || 10000;
    if (visibility < 1000) intensity += 2; // Heavy fog
    else if (visibility < 5000) intensity += 1; // Light fog
    
    return Math.min(intensity, 5); // Cap at 5
  }

  // Fallback weather when API fails
  getFallbackWeather() {
    const types = ['Storm', 'Sunshine', 'Fog', 'Rain', 'Snow'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    return {
      type: randomType,
      typeId: this.getWeatherTypeId(randomType),
      intensity: Math.floor(Math.random() * 3) + 1,
      temperature: Math.floor(Math.random() * 30) + 5,
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 25),
      description: `Simulated ${randomType.toLowerCase()}`,
      location: 'Demo Location',
      country: 'XX',
      timestamp: Date.now(),
      isRealData: false,
      apiWeatherId: 800
    };
  }

  // Get weather for multiple locations (for variety)
  async getWeatherForRandomLocation() {
    const randomLocation = DEFAULT_LOCATIONS[Math.floor(Math.random() * DEFAULT_LOCATIONS.length)];
    this.currentLocation = randomLocation;
    return await this.getCurrentWeather();
  }

  // Get user's location weather (requires geolocation permission)
  async getUserLocationWeather() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const weather = await this.getCurrentWeather(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve(weather);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          console.log('📍 Geolocation denied, using default location');
          // Fallback to default location
          this.getCurrentWeather().then(resolve).catch(reject);
        },
        { timeout: 10000 }
      );
    });
  }

  // Start automatic weather updates every 15 minutes
  startAutoUpdate(callback) {
    // Initial update
    this.getUserLocationWeather()
      .then(callback)
      .catch(console.error);

    // Set up periodic updates
    return setInterval(async () => {
      try {
        const weather = await this.getUserLocationWeather();
        callback(weather);
      } catch (error) {
        console.error('Auto weather update failed:', error);
      }
    }, 15 * 60 * 1000); // Every 15 minutes
  }

  // Stop automatic updates
  stopAutoUpdate(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  // Check if we have a valid API key
  hasValidApiKey() {
    return OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your_api_key_here';
  }

  // Get API key setup instructions
  getApiKeyInstructions() {
    return {
      step1: "Go to https://openweathermap.org/api",
      step2: "Sign up for a free account",
      step3: "Get your API key from the dashboard",
      step4: "Add REACT_APP_OPENWEATHER_API_KEY=your_key to .env file",
      step5: "Restart the development server"
    };
  }
}

// Export singleton instance
export const weatherApiService = new WeatherApiService();
export default weatherApiService;