import React, { useState } from 'react';
import { Search, Navigation, X } from 'lucide-react';

const SUGGESTED_CITIES = [
  'Athens',
  'Bangalore',
  'Budapest',
  'Chennai',
  'Copenhagen',
  'Delhi',
  'Dublin',
  'Hyderabad',
  'Kolkata',
  'Lisbon',
  'Mumbai',
  'Prague',
  'Stockholm',
  'Vienna',
  'Warsaw',
];

export default function SearchBar({ onSearch, onGeolocate, loading, isNight }) {
  const [city, setCity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = SUGGESTED_CITIES.filter((value) =>
    value.toLowerCase().includes(city.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) onSearch(city);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setShowSuggestions(false);
    onSearch(selectedCity);
  };

  const glassBase = isNight
    ? 'rgba(30,41,59,0.5)'
    : 'rgba(255,255,255,0.45)';
  const textColor = isNight ? '#f1f5f9' : '#0f172a';
  const placeholderStyle = isNight ? 'rgba(241,245,249,0.5)' : 'rgba(15,23,42,0.4)';
  const borderColor = isNight ? 'rgba(100,116,139,0.4)' : 'rgba(255,255,255,0.6)';

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="flex gap-3">
        {/* Input wrapper */}
        <div className="flex-1 relative">
          <div
            className="flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-200"
            style={{
              background: glassBase,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${borderColor}`,
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
            }}
          >
            <Search size={18} style={{ color: isNight ? 'rgba(241,245,249,0.5)' : 'rgba(15,23,42,0.4)', flexShrink: 0 }} />
            <input
              data-testid="city-search-input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search for a city..."
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: textColor, '::placeholder': { color: placeholderStyle } }}
            />
            {city && (
              <button
                type="button"
                onMouseDown={() => {
                  setCity('');
                  setShowSuggestions(false);
                }}
                className="rounded-full p-1 transition-colors duration-200 hover:bg-slate-200"
                style={{
                  color: isNight ? '#f1f5f9' : '#0f172a',
                  background: 'transparent',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {showSuggestions && (
            <div
              className="absolute left-0 right-0 mt-2 rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: isNight ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)', zIndex: 20 }}
            >
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={() => handleCitySelect(suggestion)}
                    className="w-full text-left px-4 py-3 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
                    style={{
                      color: isNight ? '#f8fafc' : '#0f172a',
                      background: 'transparent',
                      border: 'none',
                    }}
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm" style={{ color: isNight ? '#cbd5e1' : '#475569' }}>
                  No matching cities found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          data-testid="search-submit-button"
          type="submit"
          disabled={loading || !city.trim()}
          className="rounded-full px-6 py-3 font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
            boxShadow: '0 4px 15px rgba(56,189,248,0.35)',
          }}
        >
          Search
        </button>

        {/* Geolocation Button */}
        <button
          data-testid="geolocate-button"
          type="button"
          onClick={onGeolocate}
          disabled={loading}
          title="Use my current location"
          className="rounded-full p-3 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
          style={{
            background: glassBase,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${borderColor}`,
          }}
        >
          <Navigation size={20} style={{ color: isNight ? '#94a3b8' : '#475569' }} />
        </button>
      </form>
    </div>
  );
}
