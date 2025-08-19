// frontend/src/services/weatherAPI.js
// Real Weather API Integration for Somnia Grant Success
// This file transforms demo buttons into revolutionary oracle innovation

class WeatherAPIService {
  constructor() {
    // REPLACE 'your_api_key_here' with your actual OpenWeatherMap API key
    this.apiKey = process.env.REACT_APP_WEATHER_API_KEY || 'your_api_key_here';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    
    // Game weather mappings for blockchain integration
    this.gameWeatherTypes = {
      'Clear': 'SUNSHINE',
      'Clouds': 'FOG', 
      'Rain': 'RAIN',
      'Drizzle': 'RAIN',
      'Thunderstorm': 'STORM',
      'Snow': 'SNOW',
      'Mist': 'FOG',
      'Fog': 'FOG',
      'Haze': 'FOG'
    };

    // Major cities for demo (can expand to user location)
    this.demoCities = [
      'London', 'New York', 'Tokyo', 'Sydney', 'Los Angeles', 
      'Mumbai', 'Cairo', 'Moscow', 'São Paulo', 'Dubai'
    ];

    this.currentCity = 'London'; // Default city
  }

  /**
   * Get current weather for specified city
   * @param {string} city - City name
   * @returns {Object} Weather data with game-compatible format
   */
  async getCurrentWeather(city = this.currentCity) {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatWeatherForGame(data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // Fallback to demo mode if API fails
      return this.getFallbackWeather();
    }
  }

  /**
   * Get weather for random demo city (creates variety)
   * @returns {Object} Weather data for random city
   */
  async getRandomCityWeather() {
    const randomCity = this.demoCities[Math.floor(Math.random() * this.demoCities.length)];
    this.currentCity = randomCity;
    return await this.getCurrentWeather(randomCity);
  }

  /**
   * Get weather based on user's geolocation
   * @returns {Object} Weather data for user's location
   */
  async getUserLocationWeather() {
    try {
      // Get user's coordinates
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      this.currentCity = data.name;
      return this.formatWeatherForGame(data);
    } catch (error) {
      console.error('Failed to get user location weather:', error);
      // Fallback to random city
      return await this.getRandomCityWeather();
    }
  }

  /**
   * Format OpenWeatherMap data for our game
   * @param {Object} weatherData - Raw API response
   * @returns {Object} Game-formatted weather data
   */
  formatWeatherForGame(weatherData) {
    const openWeatherType = weatherData.weather[0].main;
    const gameWeatherType = this.gameWeatherTypes[openWeatherType] || 'SUNSHINE';
    
    return {
      type: gameWeatherType,
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind?.speed || 0,
      pressure: weatherData.main.pressure,
      icon: weatherData.weather[0].icon,
      timestamp: Date.now(),
      coordinates: {
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      },
      // Game-specific enhancements
      intensity: this.calculateWeatherIntensity(weatherData),
      questMultiplier: this.calculateQuestMultiplier(gameWeatherType),
      backgroundGradient: this.getWeatherGradient(gameWeatherType)
    };
  }

  /**
   * Calculate weather intensity for game mechanics
   * @param {Object} weatherData - Raw weather data
   * @returns {number} Intensity from 1-10
   */
  calculateWeatherIntensity(weatherData) {
    const weather = weatherData.weather[0].main;
    const windSpeed = weatherData.wind?.speed || 0;
    const pressure = weatherData.main.pressure;
    
    // Base intensity mapping
    const baseIntensity = {
      'Clear': 3,
      'Clouds': 4,
      'Rain': 6,
      'Drizzle': 5,
      'Thunderstorm': 9,
      'Snow': 7,
      'Mist': 4,
      'Fog': 5
    };

    let intensity = baseIntensity[weather] || 5;
    
    // Modify based on wind and pressure
    if (windSpeed > 10) intensity += 1;
    if (pressure < 1000) intensity += 1;
    
    return Math.min(Math.max(intensity, 1), 10);
  }

  /**
   * Calculate quest reward multiplier based on weather
   * @param {string} gameWeatherType - Game weather type
   * @returns {number} Multiplier for rewards
   */
  calculateQuestMultiplier(gameWeatherType) {
    const multipliers = {
      'STORM': 2.5,     // Highest risk, highest reward
      'SNOW': 2.0,      // Survival challenge
      'RAIN': 1.5,      // Resource gathering bonus
      'FOG': 1.8,       // Stealth bonus
      'SUNSHINE': 1.0   // Base multiplier
    };
    
    return multipliers[gameWeatherType] || 1.0;
  }

  /**
   * Get CSS gradient for weather background
   * @param {string} gameWeatherType - Game weather type
   * @returns {string} CSS gradient string
   */
  getWeatherGradient(gameWeatherType) {
    const gradients = {
      'STORM': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'SUNSHINE': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'RAIN': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'SNOW': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'FOG': 'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)'
    };
    
    return gradients[gameWeatherType] || gradients['SUNSHINE'];
  }

  /**
   * Fallback weather for when API is unavailable
   * @returns {Object} Demo weather data
   */
  getFallbackWeather() {
    const fallbackWeathers = [
      {
        type: 'SUNSHINE',
        city: 'Demo City',
        temperature: 22,
        description: 'clear sky',
        intensity: 3,
        questMultiplier: 1.0
      },
      {
        type: 'RAIN',
        city: 'Demo City',
        temperature: 18,
        description: 'light rain',
        intensity: 6,
        questMultiplier: 1.5
      }
    ];

    const weather = fallbackWeathers[Math.floor(Math.random() * fallbackWeathers.length)];
    return {
      ...weather,
      timestamp: Date.now(),
      backgroundGradient: this.getWeatherGradient(weather.type),
      isDemo: true // Flag to show this is demo data
    };
  }

  /**
   * Start automatic weather updates
   * @param {Function} callback - Function to call with new weather data
   * @param {number} interval - Update interval in milliseconds (default: 5 minutes)
   */
  startAutoUpdates(callback, interval = 300000) {
    // Initial weather fetch
    this.getRandomCityWeather().then(callback);

    // Set up periodic updates
    this.updateInterval = setInterval(async () => {
      const weather = await this.getRandomCityWeather();
      callback(weather);
    }, interval);

    return this.updateInterval;
  }

  /**
   * Stop automatic weather updates
   */
  stopAutoUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Validate API key functionality
   * @returns {boolean} True if API key works
   */
  async validateApiKey() {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=London&appid=${this.apiKey}`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const weatherAPIService = new WeatherAPIService();

export default weatherAPIService;

// Export weather types for other components
export const WEATHER_TYPES = {
  STORM: 'STORM',
  SUNSHINE: 'SUNSHINE', 
  RAIN: 'RAIN',
  SNOW: 'SNOW',
  FOG: 'FOG'
};

// Export for easy import in components
export { weatherAPIService };