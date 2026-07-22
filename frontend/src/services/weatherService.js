import api from './api';

export const weatherService = {
  getWeather: async (city = 'Munnar') => {
    try {
      const response = await api.get('/weather', { params: { city } });
      return response.data;
    } catch (err) {
      return {
        city: city || 'Munnar',
        temperature: 24,
        humidity: 60,
        windSpeed: 12.5,
        condition: 'Partly Cloudy',
        iconCode: '02d',
        forecast: [
          { date: 'Today', maxTemp: 24, minTemp: 16, condition: 'Partly Cloudy' },
          { date: 'Tomorrow', maxTemp: 26, minTemp: 17, condition: 'Sunny' },
          { date: 'Day 3', maxTemp: 22, minTemp: 15, condition: 'Light Rain' },
          { date: 'Day 4', maxTemp: 25, minTemp: 18, condition: 'Clear Sky' },
          { date: 'Day 5', maxTemp: 27, minTemp: 19, condition: 'Sunny' },
        ]
      };
    }
  }
};
