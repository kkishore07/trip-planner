import api from './api';

const MOCK_TRIPS = [
  {
    id: 101,
    destination: "Paris, France",
    startDate: "2026-08-15",
    endDate: "2026-08-20",
    travelersCount: 2,
    travelMode: "Flight",
    travelPreferences: "Cultural & Gourmet",
    budget: 200000,
    totalExpense: 92000,
    remainingBudget: 108000,
    itineraries: [
      { id: 1, dayNumber: 1, title: "Arrival & Eiffel Tower Magic", description: "Settle in historic Le Marais district, enjoy afternoon coffee, and experience evening glittering view of the Eiffel Tower.", activities: "Hotel Check-in, Le Marais Walk, Seine River Sunset Cruise", restaurants: "Café de Flore, Le Petit Marché", attractions: "Eiffel Tower, Notre-Dame Cathedral", suggestedTiming: "02:00 PM - 09:30 PM", estimatedCost: 12000 },
      { id: 2, dayNumber: 2, title: "Louvre Masterpieces & Gardens", description: "Full day dedicated to art appreciation, Tuileries gardens, and classic French pastry tasting.", activities: "Louvre Guided Tour, Tuileries Promenade, Bakery Workshop", restaurants: "Angelina Paris, L'As du Fallafel", attractions: "Louvre Museum, Palais-Royal Gardens", suggestedTiming: "09:30 AM - 07:00 PM", estimatedCost: 18000 },
      { id: 3, dayNumber: 3, title: "Montmartre & Sacré-Cœur Bohemian Tour", description: "Discover cobblestone streets, street artists, wine tasting in historic cellars, and panoramic city views.", activities: "Sacré-Cœur Basilica, Place du Tertre Art Market, Wine Tasting", restaurants: "Le Consulat, Chez La Mère Catherine", attractions: "Sacré-Cœur, Moulin Rouge Exterior", suggestedTiming: "10:00 AM - 08:00 PM", estimatedCost: 15000 }
    ],
    expenses: [
      { id: 1, category: "HOTEL", amount: 52000, currency: "INR", description: "Boutique Hotel Le Marais (3 nights)", expenseDate: "2026-08-15" },
      { id: 2, category: "FOOD", amount: 22000, currency: "INR", description: "Fine Dining & Bakery Tours", expenseDate: "2026-08-16" },
      { id: 3, category: "ACTIVITIES", amount: 18000, currency: "INR", description: "Louvre & Seine River VIP Passes", expenseDate: "2026-08-17" }
    ]
  },
  {
    id: 102,
    destination: "Kyoto & Tokyo, Japan",
    startDate: "2026-10-01",
    endDate: "2026-10-08",
    travelersCount: 1,
    travelMode: "Bullet Train",
    travelPreferences: "Nature & Temples",
    budget: 250000,
    totalExpense: 144000,
    remainingBudget: 106000,
    itineraries: [
      { id: 4, dayNumber: 1, title: "Kyoto Bamboo Grove & Fushimi Inari", description: "Early morning walkthrough Arashiyama bamboo forest followed by 10,000 torii gates path.", activities: "Bamboo Forest Walk, Fushimi Inari Shrine Hike", restaurants: "Gion Duck Noodles, Nishiki Market Stalls", attractions: "Fushimi Inari Taisha, Tenryu-ji Temple", suggestedTiming: "08:00 AM - 05:00 PM", estimatedCost: 10000 }
    ],
    expenses: [
      { id: 4, category: "TRANSPORT", amount: 36000, currency: "INR", description: "7-Day JR Pass & Metro Cards", expenseDate: "2026-10-01" },
      { id: 5, category: "HOTEL", amount: 68000, currency: "INR", description: "Traditional Ryokan with Onsen Bath", expenseDate: "2026-10-02" },
      { id: 6, category: "FOOD", amount: 40000, currency: "INR", description: "Ramen, Sushi & Kaiseki Dinners", expenseDate: "2026-10-03" }
    ]
  }
];

export const tripService = {
  getUserTrips: async () => {
    try {
      const response = await api.get('/trips');
      return response.data;
    } catch (err) {
      const stored = localStorage.getItem('journeymate_trips');
      return stored ? JSON.parse(stored) : MOCK_TRIPS;
    }
  },

  getTripById: async (id) => {
    try {
      const response = await api.get(`/trips/${id}`);
      return response.data;
    } catch (err) {
      const trips = await tripService.getUserTrips();
      return trips.find(t => t.id === Number(id)) || MOCK_TRIPS[0];
    }
  },

  createTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData);
      return response.data;
    } catch (err) {
      const trips = await tripService.getUserTrips();
      const newTrip = {
        id: Date.now(),
        ...tripData,
        totalExpense: 0,
        remainingBudget: tripData.budget || 80000,
        itineraries: [],
        expenses: []
      };
      trips.unshift(newTrip);
      localStorage.setItem('journeymate_trips', JSON.stringify(trips));
      return newTrip;
    }
  },

  generateAiTrip: async (aiData) => {
    try {
      const response = await api.post('/trips/generate', aiData);
      return response.data;
    } catch (err) {
      const trips = await tripService.getUserTrips();
      const duration = aiData.durationDays || 3;
      const budget = aiData.budget || 150000;
      
      const isMunnarOrCoimbatore = aiData.destination.toLowerCase().includes('munnar') || aiData.destination.toLowerCase().includes('coimbatore') || aiData.destination.toLowerCase().includes('pollachi');

      const newTrip = {
        id: Date.now(),
        destination: aiData.destination,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0],
        travelersCount: aiData.travelersCount || 1,
        travelMode: isMunnarOrCoimbatore ? "Car / Roadtrip" : "Flight",
        travelPreferences: aiData.preferences || "Balanced",
        budget: Number(budget),
        totalExpense: 0,
        remainingBudget: Number(budget),
        itineraries: Array.from({ length: duration }).map((_, i) => {
          const dayNum = i + 1;
          let title = `Day ${dayNum}: Iconic Highlights & Culture of ${aiData.destination}`;
          let description = `Personalized day plan featuring popular heritage landmarks, authentic cuisine, and scenic strolls.`;
          let activities = "City Walk, Monument Visit, Local Market Shopping";
          let restaurants = "The Central Bistro, Local Secret Kitchen";
          let attractions = `${aiData.destination} Old Town, Main Square, Panoramic Deck`;
          let suggestedTiming = "09:00 AM - 08:00 PM";
          let timelineJson = "";

          if (isMunnarOrCoimbatore) {
            if (dayNum === 1) {
              title = "Scenic Roadtrip from Coimbatore to Munnar";
              description = "Travel from Coimbatore through Chinnar Wildlife Sanctuary forest stretch, stop at Marayoor sandalwood forests, and explore Munnar's iconic tea gardens and viewpoints.";
              activities = "Scenic Forest Drive, Tea Garden Walk, Viewpoint Photos, Sandalwood Forest Sightseeing";
              restaurants = "Rapsy Restaurant (⭐ 4.2), Saravana Bhavan (⭐ 4.1), SN Restaurant";
              attractions = "Tea Gardens, Mattupetty Dam, Echo Point, Top Station, Chinnar Sanctuary";
              suggestedTiming = "04:30 AM - 09:30 PM";
              timelineJson = JSON.stringify([
                {time: "04:30 AM", title: "Leave Coimbatore", details: "Carry water, snacks, sunglasses, and a light jacket for the cool hill weather."},
                {time: "06:15 AM", title: "Breakfast at Pollachi or Udumalpet", details: "Enjoy local South Indian delicacies like soft idlis, crispy dosas, and hot filter coffee."},
                {time: "08:15 AM", title: "Chinnar Forest stretch entry", details: "Beautiful winding roads. Drive slow, watch for deer, peacocks, and monkeys. Avoid stopping where prohibited."},
                {time: "09:00 AM", title: "Marayoor Stop & Tea Break", details: "Take a tea break. Famous for sandalwood forests and pure organic jaggery making units."},
                {time: "10:00 AM", title: "Reach Munnar Hills", details: "Arrive in Munnar. Visit: 1. Tea Gardens (30-45 min), 2. Mattupetty Dam (45 min - scenic boating), 3. Echo Point (30 min), 4. Top Station (45-60 min - panoramic viewpoint)."},
                {time: "01:30 PM", title: "Lunch at Munnar Town", details: "Try Kerala meals/biryani at Rapsy Restaurant, vegetarian specialties at Saravana Bhavan, or local treats at SN Restaurant."},
                {time: "02:30 PM", title: "Start Return Journey", details: "Drive back towards Coimbatore. Optional 15-minute quick stop at Marayoor to purchase fresh jaggery or spices."},
                {time: "06:30 PM", title: "Dinner Stop at Pollachi", details: "Enjoy a traditional Tamil Nadu style dinner at Pollachi (6:30 - 7:30 PM)."},
                {time: "09:00 PM", title: "Reach Coimbatore", details: "Arrive back in Coimbatore by 9:00 - 9:30 PM, ending your memorable hill station day trip."}
              ]);
            } else {
              title = `Day ${dayNum}: Munnar Local Sightseeing & Waterfalls`;
              description = "Explore Eravikulam National Park, tea museums, and scenic waterfalls in Munnar.";
              activities = "Wildlife Spotting (Nilgiri Tahr), Tea Processing Tour, Waterfall Photos";
              restaurants = "Copper Castle Restaurant, Rapsy Restaurant";
              attractions = "Eravikulam National Park, Lakkam Waterfalls, Tea Museum";
              suggestedTiming = "09:00 AM - 06:00 PM";
              timelineJson = JSON.stringify([
                {time: "08:30 AM", title: "Breakfast at Hotel", details: "Breakfast at your stay or local town cafe."},
                {time: "09:30 AM", title: "Eravikulam National Park", details: "Spot the rare Nilgiri Tahr goat species and climb to scenic viewpoints."},
                {time: "01:00 PM", title: "Lunch at Tea Valley", details: "Traditional meals with a valley view."},
                {time: "02:30 PM", title: "Munnar Tea Museum", details: "Learn about history of tea cultivation and machinery in Munnar."},
                {time: "04:30 PM", title: "Lakkam Waterfalls", details: "Scenic waterfall surrounded by forest. Clean and refreshing water flow."},
                {time: "06:00 PM", title: "Return to Town / Evening Leisure", details: "Local shopping for homemade chocolates, tea, and spices."}
              ]);
            }
          } else {
            if (dayNum === 1) {
              timelineJson = JSON.stringify([
                {time: "09:00 AM", title: "Arrival & Hotel Check-in", details: "Settle in your hotel and refresh for the city exploration."},
                {time: "11:00 AM", title: "Walk around Central Plaza", details: "Explore the historic heart of the city, architecture, and beautiful fountains."},
                {time: "01:00 PM", title: "Welcome Lunch at Bistro", details: "Taste authentic local dishes at highly rated Grand Landmark Bistro (⭐ 4.8 based on Google reviews)."},
                {time: "03:00 PM", title: "Historic Cathedral Tour", details: "Visit the main iconic cathedral, admire the stained glass windows, and climb the tower."},
                {time: "06:00 PM", title: "Sunset Viewpoint Climb", details: "Walk up to the town's highest hill for a panoramic evening sunset vista."},
                {time: "08:00 PM", title: "Traditional Welcome Dinner", details: "Enjoy local cuisine accompanied by acoustic music at Local Heritage Grill."}
              ]);
            } else {
              timelineJson = JSON.stringify([
                {time: "09:00 AM", title: "Morning Coffee & Pastry", details: "Start your day at a cozy neighborhood cafe."},
                {time: "10:00 AM", title: "National Museum Tour", details: "Exquisite exhibition of history, artifacts, and modern art pieces."},
                {time: "01:00 PM", title: "Food Tasting Tour", details: "Sample local specialties inside market corridors."},
                {time: "03:00 PM", title: "Park Stroll", details: "Relax in local botanical gardens with lush landscaping."},
                {time: "06:00 PM", title: "Sunset Cruise", details: "Relax on an evening boat tour."},
                {time: "08:00 PM", title: "Dinner", details: "Cozy dinner at a traditional restaurant."}
              ]);
            }
          }

          return {
            id: Date.now() + i,
            dayNumber: dayNum,
            title,
            description,
            activities,
            restaurants,
            attractions,
            suggestedTiming,
            estimatedCost: Math.round(budget / duration),
            timelineJson
          };
        }),
        expenses: []
      };

      trips.unshift(newTrip);
      localStorage.setItem('journeymate_trips', JSON.stringify(trips));
      return newTrip;
    }
  },

  deleteTrip: async (id) => {
    try {
      await api.delete(`/trips/${id}`);
    } catch (err) {
      let trips = await tripService.getUserTrips();
      trips = trips.filter(t => t.id !== Number(id));
      localStorage.setItem('journeymate_trips', JSON.stringify(trips));
    }
  },

  exportPdfUrl: (tripId) => `/api/trips/${tripId}/export-pdf`
};
