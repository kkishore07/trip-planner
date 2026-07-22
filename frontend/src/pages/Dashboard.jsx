import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { StatCard } from '../components/StatCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Compass, MapPin, IndianRupee, Calendar, Sparkles, Plus, ArrowRight, PieChart as PieIcon, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const { formatAmount } = useCurrency();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getUserTrips();
      setTrips(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip itinerary?')) {
      await tripService.deleteTrip(id);
      loadTrips();
    }
  };

  const totalBudget = trips.reduce((acc, t) => acc + Number(t.budget || 0), 0);
  const totalExpense = trips.reduce((acc, t) => acc + Number(t.totalExpense || 0), 0);
  const remainingBudget = totalBudget - totalExpense;

  const chartData = [
    { name: 'Spent', value: totalExpense, color: '#ec4899' },
    { name: 'Remaining', value: Math.max(0, remainingBudget), color: '#3b82f6' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-brand-600/90 via-indigo-600/90 to-purple-600/90 text-white shadow-2xl border-none">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Travel Engine Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {user?.fullName || user?.username || 'Explorer'}! 👋
          </h1>
          <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
            Where to next? Craft personalized itineraries, analyze travel budgets, and track expenses effortlessly with JourneyMate AI.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/planner"
              className="px-5 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-sm shadow-lg flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Create AI Itinerary
            </Link>
            <Link
              to="/explore"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 flex items-center gap-2 transition-all"
            >
              Explore Recommendations
            </Link>
          </div>
        </div>
        <Compass className="absolute -right-8 -bottom-8 w-64 h-64 text-white/10 pointer-events-none rotate-12" />
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Planned Trips"
          value={trips.length}
          subtitle="Active itineraries"
          icon={MapPin}
          color="brand"
        />
        <StatCard
          title="Total Travel Budget"
          value={formatAmount(totalBudget)}
          subtitle="Allocated funds"
          icon={IndianRupee}
          color="purple"
        />
        <StatCard
          title="Total Expenses"
          value={formatAmount(totalExpense)}
          subtitle="Recorded spending"
          icon={PieIcon}
          color="emerald"
        />
        <StatCard
          title="Remaining Balance"
          value={formatAmount(remainingBudget)}
          subtitle="Available budget"
          icon={Sparkles}
          color="amber"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Trip List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-500" /> My Travel Itineraries
            </h2>
            <Link to="/planner" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={2} />
          ) : trips.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center space-y-4">
              <Compass className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No Trips Created Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">Start planning your dream trip with AI guidance in seconds.</p>
              <Link to="/planner" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md">
                Generate First Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map(trip => {
                const budget = Number(trip.budget || 0);
                const spent = Number(trip.totalExpense || 0);
                const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

                return (
                  <div key={trip.id} className="glass-card rounded-2xl p-6 transition-all hover:border-brand-500/40 relative group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                            {trip.destination}
                          </h3>
                          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                            {trip.travelMode || 'Flight'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {trip.startDate} - {trip.endDate}</span>
                          <span>• {trip.travelersCount} Traveler(s)</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                        <Link
                          to={`/trips/${trip.id}`}
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Budget Spent: {formatAmount(spent)}</span>
                        <span className="text-gray-700 dark:text-gray-300">Limit: {formatAmount(budget)} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-brand-500'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Summary & Charts */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-500" /> Platform Budget Overview
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatAmount(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border border-purple-500/20">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Pro Travel Tip
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Export your day-wise itinerary to PDF before traveling to access your activities and food recommendations offline!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
