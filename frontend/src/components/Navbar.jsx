import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { Compass, Moon, Sun, LogOut, User, LayoutDashboard, MapPin, DollarSign, CloudSun, Shield, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-gradient">JourneyMate AI</span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 ml-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full border border-brand-500/20">
              v1.0 Pro
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/dashboard') 
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            to="/trips"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/trips') || isActive('/planner')
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Trip Planner
          </Link>

          <Link
            to="/expenses"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/expenses')
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Budget & Expenses
          </Link>

          <Link
            to="/explore"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/explore')
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            Weather & Spots
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Actions Header */}
        <div className="flex items-center space-x-3">
          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-xs font-semibold px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {availableCurrencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Auth User Pill */}
          {user ? (
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-800 pl-3">
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-8 h-8 rounded-full ring-2 ring-brand-500/30 object-cover"
                />
                <span className="hidden sm:inline-block text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {user.fullName || user.username}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md hover:shadow-brand-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
