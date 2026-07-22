import React, { useState, useEffect } from 'react';
import { tripService } from '../services/tripService';
import { expenseService } from '../services/expenseService';
import { useCurrency } from '../context/CurrencyContext';
import { DollarSign, Plus, Trash2, PieChart as PieIcon, BarChart3, Tag, Calendar, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const ExpenseTracker = () => {
  const { formatAmount } = useCurrency();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    category: 'FOOD',
    amount: '',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTripId && trips.length > 0) {
      const found = trips.find(t => t.id === Number(selectedTripId));
      setCurrentTrip(found || trips[0]);
    }
  }, [selectedTripId, trips]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await tripService.getUserTrips();
      setTrips(data || []);
      if (data && data.length > 0) {
        setSelectedTripId(data[0].id);
        setCurrentTrip(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedTripId || !form.amount) return;

    try {
      await expenseService.addExpense({
        tripId: Number(selectedTripId),
        ...form,
        amount: Number(form.amount)
      });
      setForm({ ...form, amount: '', description: '' });
      loadData();
    } catch (err) {
      alert('Error adding expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete expense item?')) {
      await expenseService.deleteExpense(id, selectedTripId);
      loadData();
    }
  };

  // Recharts Data Prep
  const categoryTotals = (currentTrip?.expenses || []).reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const pieData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat]
  }));

  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-8 h-8 text-brand-500" /> Travel Budget & Expense Tracker
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor real-time spending across hotel, transport, dining, and activity categories.
          </p>
        </div>

        {/* Trip Selector */}
        {trips.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-500">Select Trip:</span>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-bold rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.destination}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {currentTrip ? (
        <div className="space-y-8">
          
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-brand-500">
              <p className="text-xs font-bold uppercase text-gray-500">Allocated Budget</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                {formatAmount(currentTrip.budget)}
              </h3>
            </div>

            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-rose-500">
              <p className="text-xs font-bold uppercase text-gray-500">Total Spent</p>
              <h3 className="text-2xl font-extrabold text-rose-500 mt-1">
                {formatAmount(currentTrip.totalExpense)}
              </h3>
            </div>

            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500">
              <p className="text-xs font-bold uppercase text-gray-500">Remaining Balance</p>
              <h3 className="text-2xl font-extrabold text-emerald-500 mt-1">
                {formatAmount((currentTrip.budget || 0) - (currentTrip.totalExpense || 0))}
              </h3>
            </div>
          </div>

          {/* Form & Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Add Expense Form */}
            <div className="glass-card rounded-3xl p-6 space-y-4 border border-gray-200/60 dark:border-gray-800/60 shadow-xl">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-500" /> Log New Expense
              </h3>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                  >
                    <option value="HOTEL">Hotel / Accommodation</option>
                    <option value="FOOD">Food & Dining</option>
                    <option value="TRANSPORT">Transportation</option>
                    <option value="ACTIVITIES">Activities & Sightseeing</option>
                    <option value="MISCELLANEOUS">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="e.g. 75.50"
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. Dinner at Le Bistro"
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    value={form.expenseDate}
                    onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Save Expense
                </button>
              </form>
            </div>

            {/* Recharts Analytics & Expense Table */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Category Breakdown Chart */}
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-brand-500" /> Category Breakdown
                </h3>
                {pieData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-gray-400">
                    No expense records added yet.
                  </div>
                ) : (
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          dataKey="value"
                          label={(entry) => `${entry.name}`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => formatAmount(val)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Expense History Table */}
              <div className="glass-card rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Expense Records</h3>
                {(!currentTrip.expenses || currentTrip.expenses.length === 0) ? (
                  <p className="text-xs text-gray-500 py-4">No expenses recorded for this trip.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-bold uppercase">
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Description</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                        {currentTrip.expenses.map(exp => (
                          <tr key={exp.id} className="hover:bg-gray-500/5">
                            <td className="py-3 font-bold text-gray-800 dark:text-gray-200">{exp.category}</td>
                            <td className="py-3 text-gray-600 dark:text-gray-400">{exp.description || '—'}</td>
                            <td className="py-3 text-gray-500">{exp.expenseDate}</td>
                            <td className="py-3 font-bold text-rose-500">{formatAmount(exp.amount)}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteExpense(exp.id)}
                                className="text-gray-400 hover:text-rose-500 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
          Please create a trip first to manage expenses.
        </div>
      )}

    </div>
  );
};
