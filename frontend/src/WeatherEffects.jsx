import React, { useEffect, useState } from 'react';

const WeatherEffects = ({ weatherType, intensity = 5 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticles = () => {
      const particleCount = Math.min(intensity * 8, 50);
      const newParticles = [];

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          delay: Math.random() * 2000,
          duration: weatherType === 3 ? 3000 + Math.random() * 2000 : 1000 + Math.random() * 1000,
        });
      }
      setParticles(newParticles);
    };

    if (weatherType !== undefined && weatherType !== 0) {
      createParticles();
    } else {
      setParticles([]);
    }
  }, [weatherType, intensity]);

  const renderWeatherElements = () => {
    switch (weatherType) {
      case 1: // Rain
        return particles.map(particle => (
          <div
            key={particle.id}
            className="rain-drop absolute pointer-events-none"
            style={{
              left: `${particle.x}px`,
              animationDelay: `${particle.delay}ms`,
              animationDuration: `${particle.duration}ms`
            }}
          />
        ));

      case 2: // Storm
        return (
          <>
            {particles.map(particle => (
              <div
                key={particle.id}
                className="storm-drop absolute pointer-events-none"
                style={{
                  left: `${particle.x}px`,
                  animationDelay: `${particle.delay}ms`,
                  animationDuration: `${particle.duration}ms`
                }}
              />
            ))}
            {/* Lightning flashes */}
            {Math.random() < 0.1 && (
              <div className="lightning-flash fixed inset-0 pointer-events-none z-50" />
            )}
          </>
        );

      case 3: // Snow
        return particles.map(particle => (
          <div
            key={particle.id}
            className="snow-flake absolute pointer-events-none"
            style={{
              left: `${particle.x}px`,
              animationDelay: `${particle.delay}ms`,
              animationDuration: `${particle.duration}ms`
            }}
          />
        ));

      case 4: // Fog
        return Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="fog-layer absolute pointer-events-none opacity-30"
            style={{
              left: `${Math.random() * window.innerWidth}px`,
              top: `${Math.random() * window.innerHeight}px`,
              animationDelay: `${i * 800}ms`
            }}
          />
        ));

      default:
        return null;
    }
  };

  if (weatherType === 0 || weatherType === undefined) {
    return null;
  }

  return (
    <div className="weather-overlay fixed inset-0 pointer-events-none z-10">
      {renderWeatherElements()}
    </div>
  );
};

export default WeatherEffects;