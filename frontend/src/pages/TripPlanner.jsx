import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { Compass, Sparkles, Calendar, DollarSign, Users, Plane, Heart, ArrowRight, MapPin, Car } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TripPlanner = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'manual'
  const [loading, setLoading] = useState(false);

  // AI Form state
  const [aiForm, setAiForm] = useState({
    destination: 'Munnar, Kerala',
    fromPlace: 'Coimbatore, Tamil Nadu',
    travelMode: 'Car / Roadtrip',
    durationDays: 1,
    travelersCount: 2,
    preferences: 'Adventure & Food',
    budget: 15000,
  });

  // Manual Form state
  const [manualForm, setManualForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelersCount: 1,
    travelMode: 'Flight',
    travelPreferences: 'Balanced',
    budget: 80000,
  });

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trip = await tripService.generateAiTrip(aiForm);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      alert('Error generating itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trip = await tripService.createTrip(manualForm);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      alert('Error creating trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Smart Travel Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Plan Your Next Adventure
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Let JourneyMate AI craft personalized day-by-day itineraries, attraction schedules, and budget allocations in seconds.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass-panel p-1.5 rounded-2xl flex space-x-2 border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Itinerary Generator
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> Custom Blank Trip
          </button>
        </div>
      </div>

      {/* AI Wizard Form */}
      {activeTab === 'ai' && (
        <form onSubmit={handleAiSubmit} className="glass-card rounded-3xl p-8 space-y-6 border border-gray-200/60 dark:border-gray-800/60 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Starting Location (From)
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={aiForm.fromPlace}
                  onChange={(e) => setAiForm({ ...aiForm, fromPlace: e.target.value })}
                  placeholder="e.g. Coimbatore, Tamil Nadu"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Destination City / Country
              </label>
              <div className="relative">
                <Compass className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={aiForm.destination}
                  onChange={(e) => setAiForm({ ...aiForm, destination: e.target.value })}
                  placeholder="e.g. Munnar, Kerala"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Mode of Transportation
              </label>
              <div className="relative">
                <Car className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
                <select
                  value={aiForm.travelMode}
                  onChange={(e) => setAiForm({ ...aiForm, travelMode: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                >
                  <option value="Car / Roadtrip">🚗 Car / Roadtrip</option>
                  <option value="Bus">🚌 Bus</option>
                  <option value="Train">🚂 Train</option>
                  <option value="Flight">✈️ Flight</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Trip Duration (Days)
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="14"
                  required
                  value={aiForm.durationDays}
                  onChange={(e) => setAiForm({ ...aiForm, durationDays: Number(e.target.value) })}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Number of Travelers
              </label>
              <div className="relative">
                <Users className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  required
                  value={aiForm.travelersCount}
                  onChange={(e) => setAiForm({ ...aiForm, travelersCount: Number(e.target.value) })}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Estimated Budget (₹ INR)
              </label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="number"
                  min="100"
                  required
                  value={aiForm.budget}
                  onChange={(e) => setAiForm({ ...aiForm, budget: Number(e.target.value) })}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Travel Style & Preferences
            </label>
            <div className="relative">
              <Heart className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={aiForm.preferences}
                onChange={(e) => setAiForm({ ...aiForm, preferences: e.target.value })}
                placeholder="e.g. Adventure, Foodie, Relaxation, Museums & Nightlife"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Generating AI Itinerary...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" /> Generate Smart Itinerary
              </>
            )}
          </button>
        </form>
      )}

      {/* Manual Form */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="glass-card rounded-3xl p-8 space-y-6 border border-gray-200/60 dark:border-gray-800/60 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                required
                value={manualForm.destination}
                onChange={(e) => setManualForm({ ...manualForm, destination: e.target.value })}
                placeholder="e.g. Barcelona, Spain"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Transportation Mode
              </label>
              <select
                value={manualForm.travelMode}
                onChange={(e) => setManualForm({ ...manualForm, travelMode: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
              >
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Car / Roadtrip">Car / Roadtrip</option>
                <option value="Cruise">Cruise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                required
                value={manualForm.startDate}
                onChange={(e) => setManualForm({ ...manualForm, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                required
                value={manualForm.endDate}
                onChange={(e) => setManualForm({ ...manualForm, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Travelers
              </label>
              <input
                type="number"
                min="1"
                value={manualForm.travelersCount}
                onChange={(e) => setManualForm({ ...manualForm, travelersCount: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Total Budget (₹ INR)
              </label>
              <input
                type="number"
                value={manualForm.budget}
                onChange={(e) => setManualForm({ ...manualForm, budget: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md"
          >
            Create Trip Container
          </button>
        </form>
      )}

    </div>
  );
};
