import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

export const InteractiveMap = ({ destination = "Paris", stops = [] }) => {
  let mapSrc = "";
  const routeMatch = destination.match(/(.+?)\s+to\s+(.+)/i);
  
  if (routeMatch) {
    const origin = routeMatch[1].trim();
    const finalDest = routeMatch[2].trim();
    if (stops && stops.length > 0) {
      const waypointsStr = stops.map(s => encodeURIComponent(s.trim())).join('+to:');
      mapSrc = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${waypointsStr}+to:${encodeURIComponent(finalDest)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
    } else {
      mapSrc = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(finalDest)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
    }
  } else if (stops && stops.length > 1) {
    const origin = stops[0];
    const finalDest = stops[stops.length - 1];
    const midStops = stops.slice(1, -1);
    if (midStops.length > 0) {
      const waypointsStr = midStops.map(s => encodeURIComponent(s.trim())).join('+to:');
      mapSrc = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${waypointsStr}+to:${encodeURIComponent(finalDest)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
    } else {
      mapSrc = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(finalDest)}&t=&z=10&ie=UTF8&iwloc=&output=embed`;
    }
  } else {
    const encodedDest = encodeURIComponent(destination);
    mapSrc = `https://maps.google.com/maps?q=${encodedDest}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }

  return (
    <div className="glass-card rounded-2xl p-4 overflow-hidden relative border border-gray-200/50 dark:border-gray-800/50">
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-brand-500 animate-pulse" />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Live Route & Roadmap</h4>
        </div>
        <span className="text-xs px-2.5 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold rounded-full border border-brand-500/20 flex items-center gap-1">
          <Compass className="w-3 h-3" /> Route Map
        </span>
      </div>

      <div className="w-full h-64 rounded-xl overflow-hidden shadow-inner relative border border-gray-300 dark:border-gray-700 bg-gray-900">
        <iframe
          title={`Map of ${destination}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapSrc}
          className="w-full h-full filter saturate-120 opacity-90 dark:opacity-80 hover:opacity-100 transition-opacity"
        ></iframe>
      </div>
    </div>
  );
};
