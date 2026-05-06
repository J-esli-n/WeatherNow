import React from 'react';
import WeatherIcon from './WeatherIcon';

const toF = (c) => Math.round(c * 9 / 5 + 32);
const fmt = (tempC, unit) => (unit === 'F' ? toF(tempC) : Math.round(tempC));

const getDayName = (dateStr, index) => {
  if (index === 0) return 'Today';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getMonthDay = (dateStr) => {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function ForecastStrip({ forecast, unit, isNight }) {
  if (!forecast.length) return null;

  const glassBg = isNight ? 'rgba(15,23,42,0.45)' : 'rgba(255,255,255,0.42)';
  const borderC = isNight ? 'rgba(100,116,139,0.35)' : 'rgba(255,255,255,0.5)';
  const textPrimary = isNight ? '#f1f5f9' : '#0f172a';
  const textSecondary = isNight ? '#94a3b8' : '#475569';
  const textMuted = isNight ? '#64748b' : '#94a3b8';

  return (
    <div data-testid="forecast-strip">
      <div
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: isNight ? '#64748b' : '#94a3b8' }}
      >
        5-Day Forecast
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x" style={{ scrollbarWidth: 'thin' }}>
        {forecast.map((day, index) => (
          <div
            key={day.date}
            data-testid={`forecast-day-${index}`}
            className="flex-shrink-0 snap-start flex flex-col items-center gap-2 rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 cursor-default"
            style={{
              background: glassBg,
              backdropFilter: 'blur(24px)',
              border: `1px solid ${borderC}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
              minWidth: '110px',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {/* Day Name */}
            <div
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: index === 0 ? '#38bdf8' : textSecondary }}
            >
              {getDayName(day.date, index)}
            </div>

            {/* Date */}
            <div className="text-xs" style={{ color: textMuted }}>
              {getMonthDay(day.date)}
            </div>

            {/* Weather Icon */}
            <WeatherIcon condition={day.condition} icon={day.icon} size="small" />

            {/* Description */}
            <div
              className="text-xs text-center capitalize leading-tight"
              style={{ color: textSecondary, maxWidth: 90 }}
            >
              {day.description}
            </div>

            {/* Temperature */}
            <div className="text-center">
              <div
                className="text-base font-bold"
                style={{ color: textPrimary, fontFamily: "'Outfit', sans-serif" }}
              >
                {fmt(day.maxTemp, unit)}°
              </div>
              <div className="text-xs" style={{ color: textMuted }}>
                {fmt(day.minTemp, unit)}°
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
