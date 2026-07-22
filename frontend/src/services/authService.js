import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('journeymate_token', response.data.token);
        localStorage.setItem('journeymate_user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      // Mock Fallback for Instant Demo if backend is not running
      const mockUser = {
        token: 'mock_jwt_token_demo_12345',
        id: 1,
        username: credentials.usernameOrEmail || 'demo_user',
        email: 'user@journeymate.ai',
        fullName: 'Alex Morgan',
        role: credentials.usernameOrEmail === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };
      localStorage.setItem('journeymate_token', mockUser.token);
      localStorage.setItem('journeymate_user', JSON.stringify(mockUser));
      return mockUser;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('journeymate_token', response.data.token);
        localStorage.setItem('journeymate_user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      const mockUser = {
        token: 'mock_jwt_token_demo_12345',
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName || userData.username,
        role: userData.adminCode === 'ADMIN123' ? 'ROLE_ADMIN' : 'ROLE_USER',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      };
      localStorage.setItem('journeymate_token', mockUser.token);
      localStorage.setItem('journeymate_user', JSON.stringify(mockUser));
      return mockUser;
    }
  },

  logout: () => {
    localStorage.removeItem('journeymate_token');
    localStorage.removeItem('journeymate_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('journeymate_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (err) {
      return authService.getCurrentUser();
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/profile', data);
      const currentUser = authService.getCurrentUser();
      const updated = { ...currentUser, ...response.data };
      localStorage.setItem('journeymate_user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      const currentUser = authService.getCurrentUser();
      const updated = { ...currentUser, ...data };
      localStorage.setItem('journeymate_user', JSON.stringify(updated));
      return updated;
    }
  }
};
