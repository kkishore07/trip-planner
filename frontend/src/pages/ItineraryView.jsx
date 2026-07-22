import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useCurrency } from '../context/CurrencyContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { AiChatDrawer } from '../components/AiChatDrawer';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Calendar, IndianRupee, Users, Plane, Download, Share2, MapPin, Clock, Utensils, Compass, CheckCircle2, ArrowLeft, Bike, CloudSun, AlertTriangle, X, Fuel, ShieldAlert } from 'lucide-react';

export const ItineraryView = () => {
  const { id } = useParams();
  const { formatAmount } = useCurrency();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Fuel Cost Estimator states
  const [fuelDistance, setFuelDistance] = useState(300);
  const [fuelMileage, setFuelMileage] = useState(15);
  const [fuelPrice, setFuelPrice] = useState(103);
  
  // Edit Form state
  const [editForm, setEditForm] = useState(null);
  const [editModalTab, setEditModalTab] = useState('general'); // 'general' or 'days'

  useEffect(() => {
    loadTripDetails();
  }, [id]);

  const parseDistancesFromItinerary = (tripData) => {
    if (!tripData || !tripData.itineraries) return 300;
    const destL = tripData.destination ? tripData.destination.toLowerCase() : "";
    const daysCount = tripData.itineraries.length || 1;

    if (destL.includes('munnar')) {
      return 155 * 2 + (daysCount > 1 ? (daysCount - 1) * 60 : 0);
    }
    if (destL.includes('valparai')) {
      return 100 * 2 + (daysCount > 1 ? (daysCount - 1) * 50 : 0);
    }
    if (destL.includes('ooty')) {
      return 270 * 2 + (daysCount > 1 ? (daysCount - 1) * 60 : 0);
    }
    if (destL.includes('jaipur')) {
      return 270 * 2 + (daysCount > 1 ? (daysCount - 1) * 45 : 0);
    }
    if (destL.includes('lonavala')) {
      return 85 * 2 + (daysCount > 1 ? (daysCount - 1) * 40 : 0);
    }

    // Heuristic: Search for regex "XX km" in timeline details/descriptions
    let parsedTotal = 0;
    const regex = /(\d+)\s*km/gi;
    
    tripData.itineraries.forEach(day => {
      let match;
      if (day.description) {
        while ((match = regex.exec(day.description)) !== null) {
          parsedTotal += parseInt(match[1], 10);
        }
      }
      if (day.timelineJson) {
        try {
          const events = JSON.parse(day.timelineJson);
          events.forEach(evt => {
            let m;
            const fullText = (evt.title || "") + " " + (evt.details || "");
            while ((m = regex.exec(fullText)) !== null) {
              parsedTotal += parseInt(m[1], 10);
            }
          });
        } catch (e) {
          // ignore
        }
      }
    });

    if (parsedTotal > 0) return parsedTotal;
    return tripData.travelMode === 'Bike' ? 250 : 350;
  };

  const loadTripDetails = async () => {
    setLoading(true);
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
      if (data) {
        const calculatedDist = parseDistancesFromItinerary(data);
        setFuelDistance(Number(data.estimatedDistance || calculatedDist));
        setFuelMileage(Number(data.fuelMileage || (data.travelMode === 'Bike' ? 40 : 15)));
        setFuelPrice(Number(data.fuelPrice || 103));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFuelSettings = async () => {
    try {
      await tripService.updateTrip(id, {
        fuelMileage,
        fuelPrice,
        estimatedDistance: fuelDistance
      });
      alert("Fuel settings saved successfully!");
      loadTripDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to save fuel settings.");
    }
  };

  const openEditModal = () => {
    if (!trip) return;
    setEditForm({
      destination: trip.destination,
      fromPlace: trip.fromPlace || '',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      travelersCount: trip.travelersCount || 1,
      travelMode: trip.travelMode || 'Flight',
      travelPreferences: trip.travelPreferences || 'Balanced',
      budget: trip.budget || 0,
      itineraries: trip.itineraries ? trip.itineraries.map(it => ({
        id: it.id,
        dayNumber: it.dayNumber,
        title: it.title || '',
        description: it.description || '',
        activities: it.activities || '',
        restaurants: it.restaurants || '',
        attractions: it.attractions || '',
        suggestedTiming: it.suggestedTiming || '',
        estimatedCost: it.estimatedCost || 0,
        climateInfo: it.climateInfo || '',
        skipSuggestions: it.skipSuggestions || '',
        bikerWarnings: it.bikerWarnings || '',
        timelineJson: it.timelineJson || ''
      })) : []
    });
    setEditModalTab('general');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripService.updateTrip(trip.id, editForm);
      setIsEditModalOpen(false);
      loadTripDetails();
    } catch (err) {
      console.error("Error updating trip", err);
      alert("Failed to save changes.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePdfDownload = () => {
    window.open(tripService.exportPdfUrl(id), '_blank');
  };

  const getStops = () => {
    if (!trip || !trip.itineraries) return [];
    const destL = trip.destination.toLowerCase();
    const fromL = (trip.fromPlace || "").toLowerCase();

    if (destL.includes('munnar') || (fromL.includes('coimbatore') && destL.includes('munnar'))) {
      return ["Pollachi", "Udumalpet", "Chinnar Wildlife Sanctuary", "Marayoor"];
    }
    if (destL.includes('ooty') || (fromL.includes('bangalore') && destL.includes('ooty'))) {
      return ["Mysore", "Bandipur National Park", "Mudumalai Forest", "Pykara Lake"];
    }
    if (destL.includes('jaipur') || (fromL.includes('delhi') && destL.includes('jaipur'))) {
      return ["Gurgaon", "Neemrana", "Shahpura", "Amber Fort"];
    }
    if (destL.includes('lonavala') || (fromL.includes('mumbai') && destL.includes('lonavala'))) {
      return ["Navi Mumbai", "Khopoli", "Khandala Ghat", "Karla Caves"];
    }

    const stopsSet = new Set();
    trip.itineraries.forEach(day => {
      if (day.attractions) {
        day.attractions.split(',').forEach(a => {
          const clean = a.trim();
          if (clean && clean.length < 35) {
            stopsSet.add(clean);
          }
        });
      }
    });
    return Array.from(stopsSet).slice(0, 4);
  };

  const renderPlacePills = (placesString) => {
    if (!placesString) return <span className="text-gray-400">None</span>;
    const places = placesString.split(',').map(p => p.trim()).filter(Boolean);
    return (
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {places.map((place, idx) => {
          const queryName = place.replace(/\(⭐\s*\d+(\.\d+)?\)/g, '').trim();
          return (
            <a
              key={idx}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-500/5 hover:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold rounded-lg border border-brand-500/10 hover:border-brand-500/20 transition-all cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-brand-500" />
              <span>{place}</span>
            </a>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="max-w-6xl mx-auto p-8"><SkeletonLoader count={3} /></div>;
  if (!trip) return <div className="max-w-6xl mx-auto p-8 text-center">Trip not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Trip Header Banner */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-brand-950/90 text-white shadow-2xl border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-brand-500/30 flex items-center gap-1 w-max">
              {trip.travelMode === 'Bike' ? <Bike className="w-3.5 h-3.5" /> : <Plane className="w-3.5 h-3.5" />} {trip.travelMode || 'Flight'} • {trip.travelPreferences || 'Cultural'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">{trip.destination}</h1>
            
            <div className="flex flex-wrap gap-4 mt-4 text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-400" /> {trip.startDate} - {trip.endDate}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-brand-400" /> {trip.travelersCount} Traveler(s)</span>
              <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-brand-400" /> Total Budget: {formatAmount(trip.budget)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openEditModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              Edit Itinerary
            </button>
            <button
              onClick={handlePdfDownload}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" /> {copied ? 'Link Copied!' : 'Share Trip'}
            </button>
          </div>
        </div>
      </div>

      {/* Biker Warning Global Banner */}
      {trip.travelMode?.toLowerCase().includes('bike') && trip.itineraries?.some(it => it.bikerWarnings) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex gap-3 text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Biker Route Advisory (Checkpost Timings)</h4>
            <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
              {trip.itineraries
                .filter(it => it.bikerWarnings)
                .map((it, idx) => (
                  <li key={idx}><strong>Day {it.dayNumber}:</strong> {it.bikerWarnings}</li>
                ))
              }
            </ul>
          </div>
        </div>
      )}

      {/* Full-Width Route Map */}
      <InteractiveMap destination={trip.destination} origin={trip.fromPlace} stops={getStops()} />

      {/* Map & Day Itinerary Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Day-Wise Activities List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-500" /> Day-by-Day AI Itinerary Schedule
          </h2>

          {(!trip.itineraries || trip.itineraries.length === 0) ? (
            <div className="glass-card rounded-2xl p-8 text-center text-gray-500">
              No detailed daily schedule generated yet.
            </div>
          ) : (
            <div className="space-y-6">
              {trip.itineraries.map((day) => {
                let timelineEvents = [];
                try {
                  if (day.timelineJson) {
                    timelineEvents = JSON.parse(day.timelineJson);
                  }
                } catch (e) {
                  console.error("Error parsing timeline JSON", e);
                }

                return (
                  <div key={day.id || day.dayNumber} className="glass-card rounded-2xl p-6 space-y-4 border border-gray-200/60 dark:border-gray-800/60 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                          {day.dayNumber}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{day.title}</h3>
                      </div>
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 bg-brand-500/10 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> {day.suggestedTiming || '09:00 AM - 08:00 PM'}
                      </span>
                    </div>

                    {/* Climate & Skip recommendations */}
                    {(day.climateInfo || day.skipSuggestions) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-brand-500/5 dark:bg-gray-850/30 p-3 rounded-xl border border-brand-500/10 mb-2 text-xs">
                        {day.climateInfo && (
                          <div>
                            <span className="font-bold text-brand-700 dark:text-brand-400 flex items-center gap-1">
                              <CloudSun className="w-3.5 h-3.5 text-brand-500" /> Climate Info:
                            </span>
                            <p className="text-gray-650 dark:text-gray-300 mt-0.5 font-medium">{day.climateInfo}</p>
                          </div>
                        )}
                        {day.skipSuggestions && (
                          <div>
                            <span className="font-bold text-rose-600 dark:text-rose-450 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Suggested Skip:
                            </span>
                            <p className="text-gray-650 dark:text-gray-300 mt-0.5 font-medium">{day.skipSuggestions}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{day.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-500" /> Planned Activities
                        </h4>
                        {renderPlacePills(day.activities)}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-500" /> Dining & Local Spots
                        </h4>
                        {renderPlacePills(day.restaurants)}
                      </div>
                    </div>

                    {/* Timeline Rendering */}
                    {timelineEvents && timelineEvents.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-150 dark:border-gray-850">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-brand-500" /> Hour-by-Hour Route Timeline
                        </h4>
                        <div className="relative border-l-2 border-brand-500/20 dark:border-brand-500/10 ml-3 pl-6 space-y-5">
                          {timelineEvents.map((evt, idx) => {
                            const isFood = /breakfast|lunch|dinner|restaurant|meals|tea|coffee|jaggery/i.test(evt.title.toLowerCase() + " " + evt.details.toLowerCase());
                            const isDrive = /leave|start|reach|journey|roadtrip|drive|return/i.test(evt.title.toLowerCase() + " " + evt.details.toLowerCase());
                            const isForest = /forest|sanctuary|wildlife|nature|deer|monkeys|peacocks/i.test(evt.title.toLowerCase() + " " + evt.details.toLowerCase());
                            
                            let iconBg = "bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400";
                            if (isFood) iconBg = "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
                            if (isDrive) iconBg = "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400";
                            if (isForest) iconBg = "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
                            
                            const queryName = evt.title.replace(/\(⭐\s*\d+(\.\d+)?\)/g, '').trim();

                            return (
                              <div key={idx} className="relative group">
                                <span className={`absolute -left-[35px] top-0.5 rounded-full p-1.5 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-sm transition-transform group-hover:scale-110 ${iconBg}`}>
                                  {isFood ? <Utensils className="w-3.5 h-3.5" /> : isDrive ? <Plane className="w-3.5 h-3.5 rotate-90" /> : isForest ? <Compass className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                </span>
                                
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                                      {evt.time}
                                    </span>
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryName)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-bold text-gray-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                                      title="Search on Google Maps"
                                    >
                                      {evt.title}
                                    </a>
                                  </div>
                                  <p className="text-[11px] text-gray-500 dark:text-gray-450 leading-relaxed whitespace-pre-line pl-1">
                                    {evt.details}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>Key Attractions:</span>
                        {renderPlacePills(day.attractions)}
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">Est. Cost: {formatAmount(day.estimatedCost)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Summary & Widgets */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-500" /> Financial Summary
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Allocated Budget:</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatAmount(trip.budget)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Total Spent to Date:</span>
                <span className="font-bold text-rose-500">{formatAmount(trip.totalExpense)}</span>
              </div>
              <div className="flex justify-between py-1 pt-2">
                <span className="text-gray-900 dark:text-white font-bold">Remaining Balance:</span>
                <span className="font-bold text-emerald-500">{formatAmount(trip.remainingBudget)}</span>
              </div>
            </div>

            <Link
              to="/expenses"
              className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-brand-500/10 hover:text-brand-600 text-gray-800 dark:text-gray-200 text-xs font-bold text-center block transition-colors"
            >
              Manage & Add Expenses
            </Link>
          </div>

          {/* Fuel Cost Estimator Widget */}
          {(trip.travelMode?.toLowerCase().includes('car') || trip.travelMode?.toLowerCase().includes('bike') || trip.travelMode?.toLowerCase().includes('road')) && (
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-indigo-500/10 bg-gradient-to-br from-slate-50 to-indigo-500/[0.02] dark:from-gray-900 dark:to-indigo-500/[0.02]">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Fuel className="w-4 h-4 text-indigo-500" /> Fuel Cost Estimator
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-gray-500 dark:text-gray-400 font-semibold">Est. Total Distance (km):</label>
                    <button
                      type="button"
                      onClick={() => {
                        const calculated = parseDistancesFromItinerary(trip);
                        setFuelDistance(calculated);
                      }}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                      title="Calculate distance from day-by-day itineraries"
                    >
                      Calculate from Itinerary
                    </button>
                  </div>
                  <input
                    type="number"
                    value={fuelDistance}
                    onChange={(e) => setFuelDistance(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 font-semibold mb-1">Mileage (km/L):</label>
                    <input
                      type="number"
                      value={fuelMileage}
                      onChange={(e) => setFuelMileage(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 font-semibold mb-1">Fuel Price (₹/L):</label>
                    <input
                      type="number"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Est. Fuel Cost:</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                    {formatAmount(Math.round((fuelDistance / Math.max(1, fuelMileage)) * fuelPrice))}
                  </span>
                </div>
                
                <button
                  onClick={handleSaveFuelSettings}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Save Fuel Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Chatbot Assistant */}
      <AiChatDrawer destinationContext={trip.destination} />

      {/* Edit Itinerary Modal */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Edit Trip Itinerary</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Modify the trip parameters or day-by-day schedules.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-150 dark:border-gray-800 px-6 py-2 bg-gray-50/50 dark:bg-gray-900/50">
              <button
                onClick={() => setEditModalTab('general')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  editModalTab === 'general'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 hover:text-gray-750 dark:hover:text-gray-300'
                }`}
              >
                Trip Details
              </button>
              <button
                onClick={() => setEditModalTab('days')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                  editModalTab === 'days'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 hover:text-gray-750 dark:hover:text-gray-300'
                }`}
              >
                Daily Schedules ({editForm.itineraries.length} Days)
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {editModalTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Destination</label>
                    <input
                      type="text"
                      required
                      value={editForm.destination}
                      onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Starting Location (From)</label>
                    <input
                      type="text"
                      value={editForm.fromPlace}
                      onChange={(e) => setEditForm({ ...editForm, fromPlace: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={editForm.endDate}
                      onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Travelers Count</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editForm.travelersCount}
                      onChange={(e) => setEditForm({ ...editForm, travelersCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Budget (₹)</label>
                    <input
                      type="number"
                      required
                      value={editForm.budget}
                      onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Travel Mode</label>
                    <select
                      value={editForm.travelMode}
                      onChange={(e) => setEditForm({ ...editForm, travelMode: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white focus:outline-none"
                    >
                      <option value="Flight">✈️ Flight</option>
                      <option value="Train">🚂 Train</option>
                      <option value="Car / Roadtrip">🚗 Car / Roadtrip</option>
                      <option value="Bike">🏍️ Bike</option>
                      <option value="Bus">🚌 Bus</option>
                      <option value="Cruise">🚢 Cruise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Preferences</label>
                    <input
                      type="text"
                      value={editForm.travelPreferences}
                      onChange={(e) => setEditForm({ ...editForm, travelPreferences: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-950 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {editModalTab === 'days' && (
                <div className="space-y-8">
                  {editForm.itineraries.map((it, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
                          {it.dayNumber}
                        </span>
                        <input
                          type="text"
                          required
                          value={it.title}
                          onChange={(e) => {
                            const newIt = [...editForm.itineraries];
                            newIt[idx].title = e.target.value;
                            setEditForm({ ...editForm, itineraries: newIt });
                          }}
                          placeholder="Day Title"
                          className="flex-1 bg-transparent border-none text-sm font-bold text-gray-950 dark:text-white focus:outline-none focus:ring-0"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Day Description</label>
                        <textarea
                          rows="2"
                          value={it.description}
                          onChange={(e) => {
                            const newIt = [...editForm.itineraries];
                            newIt[idx].description = e.target.value;
                            setEditForm({ ...editForm, itineraries: newIt });
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Activities (comma-separated)</label>
                          <input
                            type="text"
                            value={it.activities}
                            onChange={(e) => {
                              const newIt = [...editForm.itineraries];
                              newIt[idx].activities = e.target.value;
                              setEditForm({ ...editForm, itineraries: newIt });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Restaurants (comma-separated)</label>
                          <input
                            type="text"
                            value={it.restaurants}
                            onChange={(e) => {
                              const newIt = [...editForm.itineraries];
                              newIt[idx].restaurants = e.target.value;
                              setEditForm({ ...editForm, itineraries: newIt });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Key Attractions (comma-separated)</label>
                          <input
                            type="text"
                            value={it.attractions}
                            onChange={(e) => {
                              const newIt = [...editForm.itineraries];
                              newIt[idx].attractions = e.target.value;
                              setEditForm({ ...editForm, itineraries: newIt });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Climate Info</label>
                          <input
                            type="text"
                            value={it.climateInfo}
                            onChange={(e) => {
                              const newIt = [...editForm.itineraries];
                              newIt[idx].climateInfo = e.target.value;
                              setEditForm({ ...editForm, itineraries: newIt });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Skip Suggestions</label>
                          <input
                            type="text"
                            value={it.skipSuggestions}
                            onChange={(e) => {
                              const newIt = [...editForm.itineraries];
                              newIt[idx].skipSuggestions = e.target.value;
                              setEditForm({ ...editForm, itineraries: newIt });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Biker Warnings (Checkposts)</label>
                          <input
                            type="text"
                            value={it.bikerWarnings}
                            onChange={(e) => {
                              const newIt = [...editForm.itineraries];
                              newIt[idx].bikerWarnings = e.target.value;
                              setEditForm({ ...editForm, itineraries: newIt });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">Suggested Timing</label>
                          <input
                            type="text"
                            value={it.suggestedTiming}
                            onChange={(e) => {
                              const newIt = [...editForm.itineraries];
                              newIt[idx].suggestedTiming = e.target.value;
                              setEditForm({ ...editForm, itineraries: newIt });
                            }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-950 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-250 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-750 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
