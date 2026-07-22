import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';
import { recommendationService } from '../services/recommendationService';
import { CloudSun, Search, Star, MapPin, Wind, Droplets, Compass, Sparkles } from 'lucide-react';

export const WeatherRecommendations = () => {
  const [city, setCity] = useState('Munnar');
  const [searchQuery, setSearchQuery] = useState('Munnar');
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(city, category);
  }, [city, category]);

  const fetchData = async (targetCity, targetCat) => {
    setLoading(true);
    try {
      const wData = await weatherService.getWeather(targetCity);
      const rData = await recommendationService.getRecommendations(targetCity, targetCat);
      setWeather(wData);
      setRecommendations(rData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCity(searchQuery.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <CloudSun className="w-8 h-8 text-brand-500" /> Weather & Place Recommendations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Check real-time weather forecasts and discover top-rated local spots for your destination.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city (e.g. Munnar, Ooty, Jaipur)"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      {/* Weather Forecast Card */}
      {weather && (
        <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-brand-600/90 via-indigo-600/90 to-purple-600/90 text-white shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-200">Current Forecast</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold">{weather.city}</h2>
              <p className="text-sm text-brand-100 mt-1 font-semibold">{weather.condition}</p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <span className="text-5xl font-black">{weather.temperature}°C</span>
              </div>
              <div className="space-y-1 text-xs text-brand-100 border-l border-white/20 pl-6">
                <p className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-300" /> Humidity: {weather.humidity}%</p>
                <p className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-emerald-300" /> Wind: {weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>

          {/* 5 Day Forecast Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 pt-6 border-t border-white/20">
            {weather.forecast.map((day, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                <p className="text-[11px] font-bold text-brand-100">{day.date}</p>
                <p className="text-base font-extrabold my-1">{day.maxTemp}°C</p>
                <p className="text-[10px] text-brand-200">{day.condition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Curated Recommendations
          </h2>

          <div className="flex flex-wrap gap-2">
            {['ALL', 'ATTRACTIONS', 'RESTAURANTS', 'MUSEUMS', 'PARKS'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(spot => (
            <div key={spot.id} className="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform flex flex-col justify-between border border-gray-250/20 dark:border-gray-800/40">
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-gray-900">
                  <img
                    src={spot.imageUrl}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/75 backdrop-blur-md text-amber-400 text-[10px] font-black rounded-full flex items-center gap-1 shadow-lg border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 
                    <span>{spot.rating}</span>
                    {spot.reviewCount && <span className="text-gray-300 font-normal">({spot.reviewCount.toLocaleString()})</span>}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-brand-600 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow">
                    {spot.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">{spot.title}</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold shrink-0 border border-emerald-500/10">
                      Google Verified
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{spot.description}</p>
                  
                  {spot.reviewSnippet && (
                    <div className="bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-150/40 dark:border-gray-700/30">
                      <p className="text-[11px] text-gray-600 dark:text-gray-350 italic leading-relaxed">
                        &ldquo;{spot.reviewSnippet}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 pt-1">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" /> <span className="line-clamp-1">{spot.address}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
