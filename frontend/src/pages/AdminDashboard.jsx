import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useCurrency } from '../context/CurrencyContext';
import { Shield, Users, MapPin, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = () => {
  const { formatAmount } = useCurrency();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const sData = await adminService.getDashboardStats();
      const uData = await adminService.getAllUsers();
      setStats(sData);
      setUsers(uData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm(`Are you sure you want to delete user ID ${id}?`)) {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Shield className="w-8 h-8 text-purple-500" /> Admin Control Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          System analytics, platform usage metrics, and user account management.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500">
            <p className="text-xs font-bold uppercase text-gray-500">Total Registered Users</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalUsers}</h3>
          </div>

          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-brand-500">
            <p className="text-xs font-bold uppercase text-gray-500">Total Trips Generated</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalTrips}</h3>
          </div>

          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500">
            <p className="text-xs font-bold uppercase text-gray-500">Total Itineraries Built</p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalItineraries}</h3>
          </div>

          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500">
            <p className="text-xs font-bold uppercase text-gray-500">Total Managed Budget</p>
            <h3 className="text-2xl font-extrabold text-amber-500 mt-1">{formatAmount(stats.totalPlatformBudget)}</h3>
          </div>
        </div>
      )}

      {/* User Management Table */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-500" /> Platform User Management
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 font-bold uppercase">
                <th className="pb-3">User ID</th>
                <th className="pb-3">Full Name</th>
                <th className="pb-3">Username</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-500/5">
                  <td className="py-3 font-bold text-gray-500">#{u.id}</td>
                  <td className="py-3 font-bold text-gray-900 dark:text-white">{u.fullName || u.username}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">@{u.username}</td>
                  <td className="py-3 text-gray-500">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      u.role === 'ROLE_ADMIN' 
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' 
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
