import React from 'react';

const SIZE_MAP = { small: 48, medium: 64, large: 110 };

const ANIMATION_MAP = {
  Clear: 'weather-float',
  Clouds: 'weather-drift',
  Rain: 'weather-drip',
  Drizzle: 'weather-drip',
  Thunderstorm: 'weather-drip',
  Snow: 'weather-drift',
  Mist: 'weather-drift',
  Fog: 'weather-drift',
  Haze: 'weather-drift',
};

export default function WeatherIcon({ icon, condition, size = 'medium' }) {
  const px = SIZE_MAP[size] || 64;
  const animation = ANIMATION_MAP[condition] || 'weather-float';
  const src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <img
      src={src}
      alt={condition}
      width={px}
      height={px}
      className={animation}
      style={{
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
        display: 'block',
      }}
    />
  );
}
