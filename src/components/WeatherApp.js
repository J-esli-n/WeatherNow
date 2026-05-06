import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import WeatherStats from './WeatherStats';
import ForecastStrip from './ForecastStrip';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const BG_IMAGES = {
  sunny: 'https://static.prod-images.emergentagent.com/jobs/67aeb30f-81a3-4159-927c-05b5f14cafef/images/670d80f6f3b2efdf5609ed9b2dc7ad077f7600838daf38497ca2da1429b94406.png',
  rainy: 'https://static.prod-images.emergentagent.com/jobs/67aeb30f-81a3-4159-927c-05b5f14cafef/images/c7684f6c7bb3d9100f335a9a714fc9b357ca48c48831b541396b1e214e4c7f2a.png',
  night: 'https://static.prod-images.emergentagent.com/jobs/67aeb30f-81a3-4159-927c-05b5f14cafef/images/6ef0c8ee6840c25a6b4ed427ef0b74c2a5dcdb0f72cce5fad4dcede64970fd30.png',
  cloudy: 'https://images.unsplash.com/photo-1753728879531-3bf8c3626663?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwyfHxjbG91ZHklMjBza3klMjBhdG1vc3BoZXJpYyUyMG1pbmltYWx8ZW58MHx8fHwxNzc3OTk5NjM5fDA&ixlib=rb-4.1.0&q=85',
};

const getBackground = (weather) => {
  if (!weather) return BG_IMAGES.sunny;
  const condition = weather.weather[0].main.toLowerCase();
  const isNight = weather.dt < weather.sys.sunrise || weather.dt > weather.sys.sunset;
  if (condition === 'clear' && isNight) return BG_IMAGES.night;
  if (['rain', 'drizzle', 'thunderstorm'].includes(condition)) return BG_IMAGES.rainy;
  if (!['clear'].includes(condition)) return BG_IMAGES.cloudy;
  return BG_IMAGES.sunny;
};

const processForecast = (list) => {
  const dayMap = new Map();
  list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dayMap.has(date)) dayMap.set(date, []);
    dayMap.get(date).push(item);
  });
  return Array.from(dayMap.entries()).slice(0, 5).map(([date, items]) => {
    const temps = items.map((i) => i.main.temp);
    const noonItem =
      items.find((i) => i.dt_txt.includes('12:00:00')) ||
      items[Math.floor(items.length / 2)];
    return {
      date,
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      condition: noonItem.weather[0].main,
      description: noonItem.weather[0].description,
      icon: noonItem.weather[0].icon,
      dt: noonItem.dt,
    };
  });
};

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [bgImage, setBgImage] = useState(BG_IMAGES.sunny);

  const fetchWeather = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather`, {
          params: { ...params, appid: API_KEY, units: 'metric' },
        }),
        axios.get(`${BASE_URL}/forecast`, {
          params: { ...params, appid: API_KEY, units: 'metric' },
        }),
      ]);
      setWeather(weatherRes.data);
      setForecast(processForecast(forecastRes.data.list));
      setBgImage(getBackground(weatherRes.data));
    } catch (err) {
      if (err.response?.status === 401) {
        setError('API key is not yet active. New keys may take up to 10 minutes to activate.');
      } else if (err.response?.status === 404) {
        setError('City not found. Please check the spelling and try again.');
      } else {
        setError(err.response?.data?.message || 'Unable to fetch weather. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (city) => {
    if (city.trim()) fetchWeather({ q: city.trim() });
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        fetchWeather({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => {
        setError('Unable to get your location. Please search manually.');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchWeather({ q: 'London' });
  }, [fetchWeather]);

  const isNight =
    weather &&
    (weather.dt < weather.sys.sunrise || weather.dt > weather.sys.sunset);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Manrope', sans-serif",
        transition: 'background-image 0.8s ease-in-out',
      }}
    >
      {/* Frosted overlay */}
      <div
        className="min-h-screen w-full"
        style={{
          background: isNight
            ? 'rgba(15, 23, 42, 0.25)'
            : 'rgba(240, 249, 255, 0.15)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-8 pb-16">
          {/* Header */}
          <div className="text-center mb-8 card-enter card-enter-1">
            <h1
              className="text-4xl sm:text-5xl font-semibold mb-1"
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: isNight ? '#f1f5f9' : '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              WeatherNow
            </h1>
            <p
              className="text-sm"
              style={{ color: isNight ? 'rgba(241,245,249,0.7)' : 'rgba(15,23,42,0.55)' }}
            >
              Real-time weather at your fingertips
            </p>
          </div>

          {/* Search Bar */}
          <div className="card-enter card-enter-2">
            <SearchBar
              onSearch={handleSearch}
              onGeolocate={handleGeolocation}
              loading={loading}
              isNight={isNight}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mt-5 p-4 rounded-2xl text-center text-sm font-medium animate-fade-in"
              style={{
                background: 'rgba(254,226,226,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(252,165,165,0.5)',
                color: '#b91c1c',
              }}
              data-testid="error-message"
            >
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && !weather && (
            <div className="mt-16 flex justify-center animate-fade-in">
              <div className="spinner" />
            </div>
          )}

          {/* Main Content */}
          {weather && (
            <div className="mt-6 anima te-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Current Weather Hero Card */}
                <div className="col-span-1 md:col-span-8 card-enter card-enter-3">
                  <CurrentWeather
                    weather={weather}
                    unit={unit}
                    onToggleUnit={() =>
                      setUnit((u) => (u === 'C' ? 'F' : 'C'))
                    }
                    isNight={isNight}
                  />
                </div>

                {/* Stats Cards */}
                <div className="col-span-1 md:col-span-4 card-enter card-enter-4">
                  <WeatherStats weather={weather} unit={unit} isNight={isNight} />
                </div>

                {/* Forecast Strip */}
                <div className="col-span-1 md:col-span-12 card-enter card-enter-5">
                  <ForecastStrip
                    forecast={forecast}
                    unit={unit}
                    isNight={isNight}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
