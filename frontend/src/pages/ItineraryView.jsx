import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useCurrency } from '../context/CurrencyContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { AiChatDrawer } from '../components/AiChatDrawer';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Calendar, DollarSign, Users, Plane, Download, Share2, MapPin, Clock, Utensils, Compass, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ItineraryView = () => {
  const { id } = useParams();
  const { formatAmount } = useCurrency();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTripDetails();
  }, [id]);

  const loadTripDetails = async () => {
    setLoading(true);
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    if (trip.destination.toLowerCase().includes('coimbatore') && trip.destination.toLowerCase().includes('munnar')) {
      return ["Pollachi", "Udumalpet", "Chinnar Wildlife Sanctuary", "Marayoor"];
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
            <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-brand-500/30">
              {trip.travelMode || 'Flight'} • {trip.travelPreferences || 'Cultural'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">{trip.destination}</h1>
            
            <div className="flex flex-wrap gap-4 mt-4 text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-brand-400" /> {trip.startDate} - {trip.endDate}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-brand-400" /> {trip.travelersCount} Traveler(s)</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-brand-400" /> Total Budget: {formatAmount(trip.budget)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{day.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-500" /> Planned Activities
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{day.activities}</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-500" /> Dining & Local Spots
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{day.restaurants}</p>
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
                                    <h5 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                                      {evt.title}
                                    </h5>
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

                    <div className="flex justify-between items-center pt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Key Attraction: <strong>{day.attractions}</strong></span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Est. Cost: {formatAmount(day.estimatedCost)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Interactive Map & Expense Summary */}
        <div className="space-y-6">
          <InteractiveMap destination={trip.destination} stops={getStops()} />

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Financial Summary
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
        </div>

      </div>

      {/* Floating AI Chatbot Assistant */}
      <AiChatDrawer destinationContext={trip.destination} />
    </div>
  );
};
