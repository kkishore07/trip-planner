import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle, Calculator, ArrowRightLeft } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const TravelChecklist = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Passport & Visa Documents', done: true },
    { id: 2, text: 'Travel Insurance Certificate', done: true },
    { id: 3, text: 'Universal Power Adapter & Chargers', done: false },
    { id: 4, text: 'First Aid Kit & Medications', done: false },
    { id: 5, text: 'Comfortable Walking Shoes', done: true }
  ]);
  const [newItemText, setNewItemText] = useState('');

  // Currency Converter state
  const { availableCurrencies, formatAmount } = useCurrency();
  const [convertAmount, setConvertAmount] = useState('10000');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItems([...items, { id: Date.now(), text: newItemText.trim(), done: false }]);
    setNewItemText('');
  };

  const toggleDone = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Convert Calculation
  const rates = { INR: 1.0, USD: 0.012, EUR: 0.011, GBP: 0.0093, JPY: 1.85 };
  const inUsd = Number(convertAmount || 0) / (rates[fromCurrency] || 1);
  const convertedValue = inUsd * (rates[toCurrency] || 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Travel Checklist Tool */}
        <div className="glass-card rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-brand-500" /> Travel Packing Checklist
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full">
              {items.filter(i => i.done).length} / {items.length} Checked
            </span>
          </div>

          <form onSubmit={addItem} className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add packing item (e.g. Sunscreen)"
              className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => toggleDone(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${
                  item.done
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-400 line-through'
                    : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-xs font-semibold">{item.text}</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                  className="text-gray-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Currency Converter Tool */}
        <div className="glass-card rounded-3xl p-6 space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-500" /> Live Currency Converter
            </h2>
            <p className="text-xs text-gray-500 mt-1">Convert costs easily while planning international trips.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Amount</label>
              <input
                type="number"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                >
                  {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                >
                  {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-center space-y-1 bg-purple-500/10 border-purple-500/20">
              <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">Converted Output</span>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
              </h3>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
