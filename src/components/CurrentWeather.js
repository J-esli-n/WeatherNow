import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

const toF = (c) => Math.round(c * 9 / 5 + 32);
const formatTemp = (tempC, unit) => (unit === 'F' ? toF(tempC) : Math.round(tempC));

const formatDate = (dt) =>
  new Date(dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

const formatTime = (dt) =>
  new Date(dt * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function CurrentWeather({ weather, unit, onToggleUnit, isNight }) {
  const temp = formatTemp(weather.main.temp, unit);
  const feelsLike = formatTemp(weather.main.feels_like, unit);
  const high = formatTemp(weather.main.temp_max, unit);
  const low = formatTemp(weather.main.temp_min, unit);

  const glassBg = isNight ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.42)';
  const borderC = isNight ? 'rgba(100,116,139,0.35)' : 'rgba(255,255,255,0.5)';
  const textPrimary = isNight ? '#f1f5f9' : '#0f172a';
  const textSecondary = isNight ? '#94a3b8' : '#475569';
  const textMuted = isNight ? '#64748b' : '#94a3b8';

  return (
    <div
      className="rounded-3xl p-8 h-full flex flex-col justify-between"
      style={{
        background: glassBg,
        backdropFilter: 'blur(24px)',
        border: `1px solid ${borderC}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
      data-testid="current-weather-card"
    >
      {/* Top Row: Location + Toggle */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
            <h2
              className="text-2xl font-semibold"
              style={{ color: textPrimary, fontFamily: "'Outfit', sans-serif" }}
            >
              {weather.name}, {weather.sys.country}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} style={{ color: textMuted }} />
            <span className="text-sm" style={{ color: textSecondary }}>
              {formatDate(weather.dt)} · Updated {formatTime(weather.dt)}
            </span>
          </div>
        </div>

        {/* C/F Toggle */}
        <button
          data-testid="temp-unit-toggle"
          onClick={onToggleUnit}
          className="flex items-center rounded-full p-1 transition-all duration-300"
          style={{
            background: isNight ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${borderC}`,
          }}
        >
          {['C', 'F'].map((u) => (
            <span
              key={u}
              className="px-3 py-1 rounded-full text-sm font-bold transition-all duration-300"
              style={{
                background: unit === u
                  ? isNight ? '#1e293b' : 'white'
                  : 'transparent',
                color: unit === u ? (isNight ? '#f1f5f9' : '#0f172a') : textMuted,
                boxShadow: unit === u ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              °{u}
            </span>
          ))}
        </button>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="weather-float">
          <WeatherIcon
            condition={weather.weather[0].main}
            icon={weather.weather[0].icon}
            size="large"
          />
        </div>
        <div>
          <div
            className="leading-none tracking-tighter"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(4rem, 10vw, 6rem)',
              fontWeight: 300,
              color: textPrimary,
            }}
          >
            {temp}°{unit}
          </div>
          <div
            className="text-xl font-medium mt-1 capitalize"
            style={{ color: textSecondary }}
          >
            {weather.weather[0].description}
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-sm" style={{ color: textMuted }}>
              Feels like {feelsLike}°{unit}
            </span>
            <span className="text-sm" style={{ color: textMuted }}>
              H: {high}° · L: {low}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}