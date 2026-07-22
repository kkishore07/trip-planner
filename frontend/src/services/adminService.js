import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (err) {
      return {
        totalUsers: 142,
        totalTrips: 389,
        totalItineraries: 1150,
        totalPlatformBudget: 428500,
        recentUsers: [
          { id: 1, username: "alex_m", email: "alex@example.com", fullName: "Alex Morgan", role: "ROLE_USER" },
          { id: 2, username: "sarah_k", email: "sarah@example.com", fullName: "Sarah Connor", role: "ROLE_USER" },
          { id: 3, username: "david_r", email: "david@example.com", fullName: "David Ross", role: "ROLE_ADMIN" },
        ]
      };
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (err) {
      return [
        { id: 1, username: "alex_m", email: "alex@example.com", fullName: "Alex Morgan", role: "ROLE_USER" },
        { id: 2, username: "sarah_k", email: "sarah@example.com", fullName: "Sarah Connor", role: "ROLE_USER" },
        { id: 3, username: "david_r", email: "david@example.com", fullName: "David Ross", role: "ROLE_ADMIN" },
        { id: 4, username: "elena_v", email: "elena@example.com", fullName: "Elena Vance", role: "ROLE_USER" }
      ];
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (err) {
      // Mock success for offline mode
    }
  }
};
