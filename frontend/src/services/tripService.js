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
      const destLower = aiData.destination.toLowerCase();
      const fromP = aiData.fromPlace || "";
      const fromLower = fromP.toLowerCase();
      const modeOfTransport = aiData.travelMode || "Flight";

      const isMunnarRoute = destLower.includes("munnar") || (fromLower.includes("coimbatore") && destLower.includes("munnar"));
      const isOotyRoute = destLower.includes("ooty") || (fromLower.includes("bangalore") && destLower.includes("ooty"));
      const isJaipurRoute = destLower.includes("jaipur") || (fromLower.includes("delhi") && destLower.includes("jaipur"));
      const isLonavalaRoute = destLower.includes("lonavala") || (fromLower.includes("mumbai") && destLower.includes("lonavala"));

      const newTrip = {
        id: Date.now(),
        destination: aiData.destination,
        fromPlace: fromP,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0],
        travelersCount: aiData.travelersCount || 1,
        travelMode: modeOfTransport,
        travelPreferences: aiData.preferences || "Balanced",
        budget: Number(budget),
        fuelMileage: modeOfTransport === 'Bike' ? 40.0 : 15.0,
        fuelPrice: 103.0,
        estimatedDistance: 300.0,
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

          if (isMunnarRoute) {
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
          } else if (isOotyRoute) {
            if (dayNum === 1) {
              title = "Scenic Hill Roadtrip from Bangalore to Ooty";
              description = "Travel from Bangalore through the historic city of Mysore, cross the Bandipur tiger reserve forest, and ascend to Ooty via Pykara Lake.";
              activities = "Wildlife Spotting, Mysore Palace Visit, Boating, Pykara Waterfalls Photography";
              restaurants = "Mylari Hotel (⭐ 4.4), Nahar Restaurant (⭐ 4.1), Earl's Secret (⭐ 4.5)";
              attractions = "Mysore Palace, Bandipur National Park, Pykara Waterfalls, Ooty Lake";
              suggestedTiming = "05:00 AM - 08:30 PM";
              timelineJson = JSON.stringify([
                {time: "05:00 AM", title: "Leave Bangalore", details: "Depart early to beat the city traffic and enjoy the cool morning drive on the Mysore Expressway."},
                {time: "07:30 AM", title: "Breakfast at Mysore", details: "Stop at the famous Mylari Hotel (⭐ 4.4 based on Google reviews) for their legendary soft butter idlis and filter coffee."},
                {time: "10:00 AM", title: "Bandipur National Park Drive", details: "Enter the forest stretch. Drive slow. Keep an eye out for elephants, deer, and peacocks crossing the road."},
                {time: "12:30 PM", title: "Pykara Waterfalls & Lake", details: "Stop at Pykara for a scenic short walk to the waterfalls and optional speedboat rides on the lake."},
                {time: "02:00 PM", title: "Reach Ooty & Lunch", details: "Arrive in Ooty. Enjoy a traditional North/South Indian lunch at Nahar Restaurant (⭐ 4.1, 8,920 reviews)."},
                {time: "03:30 PM", title: "Ooty Botanical Garden", details: "Explore the lush 55-hectare gardens featuring rare trees, fossil trunks, and beautiful glass houses."},
                {time: "06:00 PM", title: "Ooty Lake & Boating", details: "Relax with a quiet rowboat ride on the scenic Ooty Lake as the sun goes down."},
                {time: "08:00 PM", title: "Dinner at Earl's Secret", details: "Dine in a gorgeous glasshouse restaurant at Earl's Secret (⭐ 4.5, 3,450 Google reviews) inside a colonial heritage hotel."}
              ]);
            } else {
              title = `Day ${dayNum}: Ooty Heritage Toy Train & Coonoor Tour`;
              description = "Take the historic UNESCO Nilgiri Mountain Railway Toy Train from Ooty to Coonoor and explore Dolphin's Nose and tea processing units.";
              activities = "UNESCO Toy Train Ride, Tea Factory Tour, Scenic Viewpoint Hike";
              restaurants = "Cafe Diem (⭐ 4.4), Quality Restaurant";
              attractions = "Nilgiri Mountain Railway, Dolphin's Nose, Sim's Park, Tea Factory";
              suggestedTiming = "08:30 AM - 06:30 PM";
              timelineJson = JSON.stringify([
                {time: "08:30 AM", title: "Ooty Toy Train Ride", details: "Board the famous steam Toy Train from Ooty station to Coonoor. Enjoy scenic valleys, tunnels, and stone bridges."},
                {time: "10:30 AM", title: "Sim's Park & Botanical Walks", details: "Stroll in Sim's Park in Coonoor, showcasing unique plant species and terraced landscaping."},
                {time: "12:00 PM", title: "Dolphin's Nose Viewpoint", details: "Drive to Dolphin's Nose for a breathtaking view of Catherine Falls and the valley."},
                {time: "01:30 PM", title: "Lunch at Cafe Diem", details: "Enjoy vegetarian organic dishes with spectacular valley views at Cafe Diem (⭐ 4.4, 2,120 Google reviews)."},
                {time: "03:30 PM", title: "Highfield Tea Factory", details: "Observe how tea leaves are processed and try tea tasting of fresh chocolate and masala teas."},
                {time: "06:00 PM", title: "Return to Ooty & Leisure", details: "Stroll around Ooty Charing Cross market for local eucalyptus oil and homemade chocolates."}
              ]);
            }
          } else if (isJaipurRoute) {
            if (dayNum === 1) {
              title = "Delhi to Jaipur - The Pink City Roadtrip";
              description = "Drive from Delhi through Haryana to Rajasthan. Tour the spectacular Amber Fort, Jal Mahal, and finish with a traditional Rajasthani dinner show.";
              activities = "Fort Guided Tour, Stepwell Photography, Rajasthani Folk Show, Camel Ride";
              restaurants = "Neemrana Fort Restaurant (⭐ 4.5), Laxmi Mishthan Bhandar (LMB) (⭐ 4.0), Chokhi Dhani (⭐ 4.3)";
              attractions = "Neemrana Fort, Amber Fort, Jal Mahal, Chokhi Dhani";
              suggestedTiming = "06:00 AM - 09:30 PM";
              timelineJson = JSON.stringify([
                {time: "06:00 AM", title: "Depart Delhi", details: "Start early from Delhi to beat the Gurgaon Expressway traffic."},
                {time: "08:30 AM", title: "Breakfast at Neemrana Fort Palace", details: "Have a royal breakfast at the stunning 15th-century Neemrana Fort Palace (⭐ 4.5 Google reviews) overlooking the hills."},
                {time: "12:00 PM", title: "Stop at Chand Baori Stepwell", details: "Take a short detour to see Abhaneri's Chand Baori, one of the deepest and largest stepwells in India."},
                {time: "02:00 PM", title: "Reach Jaipur & Lunch", details: "Arrive in Jaipur and check in. Head for a delicious lunch at Laxmi Mishthan Bhandar (LMB) (⭐ 4.0, 15,230 reviews) for authentic Rajasthani Thali."},
                {time: "04:00 PM", title: "Amber Fort Tour", details: "Explore the massive Amber Fort, its beautiful Sheesh Mahal (mirror palace), and take in the panoramic mountain views."},
                {time: "06:30 PM", title: "Sunset view at Jal Mahal", details: "Stop for photos of Jal Mahal, the floating palace, reflecting in the Mansagar Lake during sunset."},
                {time: "08:00 PM", title: "Dinner at Chokhi Dhani", details: "Experience Rajasthani village culture, puppet shows, camel rides, and traditional dining at Chokhi Dhani (⭐ 4.3, 28,450 Google reviews)."}
              ]);
            } else {
              title = `Day ${dayNum}: Jaipur City Palace & Observatory`;
              description = "Explore Hawa Mahal, City Palace, and the Jantar Mantar observatory in Jaipur.";
              activities = "Historical Palace Tour, Ancient Instrument Viewing, Local Crafts Shopping";
              restaurants = "Tapri Central, Peacock Rooftop Restaurant";
              attractions = "Hawa Mahal, City Palace, Jantar Mantar, Johari Bazaar";
              suggestedTiming = "09:00 AM - 06:00 PM";
              timelineJson = JSON.stringify([
                {time: "09:00 AM", title: "Hawa Mahal Photos", details: "Visit the iconic Palace of Winds early in the morning for best lighting."},
                {time: "10:00 AM", title: "City Palace Museum", details: "Explore courtyards, museums, royal armory, and gorgeous doorways."},
                {time: "12:30 PM", title: "Jantar Mantar Observatory", details: "Learn about the UNESCO-listed astronomical sundials and instruments."},
                {time: "02:00 PM", title: "Peacock Rooftop Lunch", details: "Enjoy local Rajasthani curries at Peacock Rooftop Restaurant (⭐ 4.4)."},
                {time: "03:30 PM", title: "Johari Bazaar Shopping", details: "Shop for traditional blue pottery, jaipuri quilts, and bandhani clothing."},
                {time: "05:30 PM", title: "Tea at Tapri Central", details: "Cozy rooftop tea bar Tapri (⭐ 4.6) for chai, bun-maska, and sunset views."}
              ]);
            }
          } else if (isLonavalaRoute) {
            if (dayNum === 1) {
              title = "Mumbai to Lonavala - Western Ghats Monsoon Escape";
              description = "Drive from Mumbai via the scenic Pune Expressway to the mist-filled hills of Lonavala. Explore historic rock-cut caves and view gorgeous waterfalls.";
              activities = "Expressway Scenic Drive, Cave Exploration, Viewpoint Trekking, Fudge Tasting";
              restaurants = "Sunny Da Dhaba (⭐ 4.1), Cooper's Fudge (⭐ 4.3), German Bakery Lonavala";
              attractions = "Khandala Ghat, Karla Caves, Tiger's Point, Bhushi Dam";
              suggestedTiming = "07:00 AM - 08:30 PM";
              timelineJson = JSON.stringify([
                {time: "07:00 AM", title: "Leave Mumbai", details: "Start from Mumbai and climb the scenic Mumbai-Pune Expressway."},
                {time: "08:30 AM", title: "Breakfast at Sunny Da Dhaba", details: "Stop at Sunny Da Dhaba (⭐ 4.1 Google reviews) for hot stuffed parathas and sweet lassi."},
                {time: "10:00 AM", title: "Karla Caves Exploration", details: "Hike up to the ancient 2nd century BC Buddhist rock-cut shrines, featuring grand pillars and arched ceilings."},
                {time: "12:00 PM", title: "Tiger's Point Viewpoint", details: "Head to Tiger's Point for a stunning view of steep valleys, waterfalls, and mist-laden mountains. Enjoy hot corn pakodas."},
                {time: "01:30 PM", title: "Lunch at Cooper's Fudge", details: "Enjoy delicious lunch followed by purchase of their legendary chocolate walnut fudge at Cooper's Fudge (⭐ 4.3, 4,920 reviews)."},
                {time: "03:30 PM", title: "Bhushi Dam", details: "Splash around and relax on the steps of Bhushi Dam with cascading water streams."},
                {time: "05:30 PM", title: "Sunset at Lion's Point", details: "Watch the sunset paint the Western Ghats orange from Lion's Point viewpoint."},
                {time: "07:30 PM", title: "Return Journey to Mumbai", details: "Drive back to Mumbai via the Expressway, arriving by 9:00 PM."}
              ]);
            } else {
              title = `Day ${dayNum}: Lonavala Nature & Fort Sightseeing`;
              description = "Visit Lohagad Fort and Bhaja Caves for ancient architectural scenery.";
              activities = "Fort Trekking, Cave Photography, Lake Sightseeing";
              restaurants = "Rama Krishna Restaurant, Kinara Village Dhaba";
              attractions = "Lohagad Fort, Bhaja Caves, Pawna Lake";
              suggestedTiming = "09:00 AM - 05:00 PM";
              timelineJson = JSON.stringify([
                {time: "08:30 AM", title: "Breakfast at Stay", details: "Enjoy hot maharashtrian poha or misal pav."},
                {time: "09:30 AM", title: "Lohagad Fort Trek", details: "Trek up to Lohagad Fort, the iron fort of Shivaji. Enjoy stunning mountain trails."},
                {time: "01:00 PM", title: "Lunch at Rama Krishna", details: "Delicious Punjabi and South Indian food in Lonavala Town."},
                {time: "02:30 PM", title: "Bhaja Caves visit", details: "Explore Buddhist caves with beautiful stupas and carvings."},
                {time: "04:30 PM", title: "Pawna Lake Sunset", details: "Sit by the peaceful shores of Pawna Lake for a beautiful sunset view."}
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

  updateTrip: async (id, tripData) => {
    try {
      const response = await api.put(`/trips/${id}`, tripData);
      return response.data;
    } catch (err) {
      let trips = await tripService.getUserTrips();
      const idx = trips.findIndex(t => t.id === Number(id));
      if (idx !== -1) {
        let updatedItineraries = trips[idx].itineraries;
        if (tripData.itineraries) {
          updatedItineraries = trips[idx].itineraries.map(originalIt => {
            const reqIt = tripData.itineraries.find(it => it.id === originalIt.id || it.dayNumber === originalIt.dayNumber);
            return reqIt ? { ...originalIt, ...reqIt } : originalIt;
          });
        }
        trips[idx] = {
          ...trips[idx],
          ...tripData,
          itineraries: updatedItineraries,
          remainingBudget: (tripData.budget || trips[idx].budget) - (trips[idx].totalExpense || 0)
        };
        localStorage.setItem('journeymate_trips', JSON.stringify(trips));
        return trips[idx];
      }
      throw err;
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
