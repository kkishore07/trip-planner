import api from './api';
import { tripService } from './tripService';

export const expenseService = {
  addExpense: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (err) {
      const trips = await tripService.getUserTrips();
      const trip = trips.find(t => t.id === Number(expenseData.tripId));
      if (trip) {
        const newExpense = {
          id: Date.now(),
          ...expenseData,
          amount: Number(expenseData.amount),
          expenseDate: expenseData.expenseDate || new Date().toISOString().split('T')[0]
        };
        if (!trip.expenses) trip.expenses = [];
        trip.expenses.unshift(newExpense);
        trip.totalExpense = (trip.totalExpense || 0) + newExpense.amount;
        trip.remainingBudget = (trip.budget || 0) - trip.totalExpense;
        localStorage.setItem('journeymate_trips', JSON.stringify(trips));
        return newExpense;
      }
      throw err;
    }
  },

  deleteExpense: async (id, tripId) => {
    try {
      await api.delete(`/expenses/${id}`);
    } catch (err) {
      const trips = await tripService.getUserTrips();
      const trip = trips.find(t => t.id === Number(tripId));
      if (trip && trip.expenses) {
        const exp = trip.expenses.find(e => e.id === Number(id));
        if (exp) {
          trip.totalExpense = Math.max(0, (trip.totalExpense || 0) - exp.amount);
          trip.remainingBudget = (trip.budget || 0) - trip.totalExpense;
          trip.expenses = trip.expenses.filter(e => e.id !== Number(id));
          localStorage.setItem('journeymate_trips', JSON.stringify(trips));
        }
      }
    }
  }
};
