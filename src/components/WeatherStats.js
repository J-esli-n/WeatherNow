import React from 'react';
import { Droplets, Wind, Eye, Gauge, Sun, Moon } from 'lucide-react';

const formatTime = (dt) =>
  new Date(dt * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

const STATS = (weather, unit) => {
  const windSpeed =
    unit === 'F'
      ? `${Math.round(weather.wind.speed * 2.237)} mph`
      : `${Math.round(weather.wind.speed * 3.6)} km/h`;

  return [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      color: '#38bdf8',
      testId: 'stat-humidity',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: windSpeed,
      color: '#67e8f9',
      testId: 'stat-wind',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      color: '#818cf8',
      testId: 'stat-visibility',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      color: '#a78bfa',
      testId: 'stat-pressure',
    },
    {
      icon: Sun,
      label: 'Sunrise',
      value: formatTime(weather.sys.sunrise),
      color: '#fbbf24',
      testId: 'stat-sunrise',
    },
    {
      icon: Moon,
      label: 'Sunset',
      value: formatTime(weather.sys.sunset),
      color: '#f97316',
      testId: 'stat-sunset',
    },
  ];
};

export default function WeatherStats({ weather, unit, isNight }) {
  const stats = STATS(weather, unit);
  const glassBg = isNight ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.42)';
  const borderC = isNight ? 'rgba(100,116,139,0.35)' : 'rgba(255,255,255,0.5)';
  const textPrimary = isNight ? '#f1f5f9' : '#0f172a';
  const textLabel = isNight ? '#64748b' : '#94a3b8';

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          data-testid={stat.testId}
          className={`rounded-2xl p-4 hover:-translate-y-0.5 transition-all duration-300 card-enter card-enter-${i + 1}`}
          style={{
            background: glassBg,
            backdropFilter: 'blur(24px)',
            border: `1px solid ${borderC}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          }}
        >
          <stat.icon size={18} style={{ color: stat.color, marginBottom: 8 }} />
          <div
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: textLabel }}
          >
            {stat.label}
          </div>
          <div
            className="text-base font-semibold"
            style={{ color: textPrimary, fontFamily: "'Outfit', sans-serif" }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
