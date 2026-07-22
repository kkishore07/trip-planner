import api from './api';

export const recommendationService = {
  getRecommendations: async (destination, category) => {
    try {
      const response = await api.get('/recommendations', { params: { destination, category } });
      return response.data;
    } catch (err) {
      const dest = destination || 'Top Pick';
      const destLower = dest.toLowerCase();
      let list = [];
      
      if (destLower.includes('munnar') || destLower.includes('coimbatore') || destLower.includes('pollachi')) {
        list = [
          {
            id: 101,
            destinationName: "Munnar",
            category: "ATTRACTIONS",
            title: "Tea Gardens & Photo Point",
            description: "Lush green terraced tea estates. Best scenic walk and photography spots in Munnar.",
            rating: 4.6,
            address: "Munnar Hills, Munnar, Kerala",
            imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
            reviewCount: 24500,
            reviewSnippet: "The best scenic tea estate walks. Photographers' paradise with emerald slopes!"
          },
          {
            id: 102,
            destinationName: "Munnar",
            category: "ATTRACTIONS",
            title: "Mattupetty Dam & Lake",
            description: "Scenic gravity dam and lake surrounded by hills. Speed boating and horse riding are popular.",
            rating: 4.3,
            address: "Mattupetty, Munnar, Kerala",
            imageUrl: "https://images.unsplash.com/photo-1616388968889-aa2f75685a3e?auto=format&fit=crop&w=600&q=80",
            reviewCount: 15200,
            reviewSnippet: "Excellent spot for boating and panoramic lake views. Spotted some elephants!"
          },
          {
            id: 103,
            destinationName: "Munnar",
            category: "ATTRACTIONS",
            title: "Echo Point",
            description: "A high point where your voice echoes back. Beautiful lake side views and mist-filled hills.",
            rating: 4.4,
            address: "Munnar-Top Station Highway, Munnar, Kerala",
            imageUrl: "https://images.unsplash.com/photo-1593693411515-c202e974eb18?auto=format&fit=crop&w=600&q=80",
            reviewCount: 9180,
            reviewSnippet: "Fun spot to shout out and hear the echo! Beautiful surrounding green valleys."
          },
          {
            id: 104,
            destinationName: "Munnar",
            category: "ATTRACTIONS",
            title: "Top Station Viewpoint",
            description: "The highest point in Munnar, offering panoramic views of the Western Ghats if sky is clear.",
            rating: 4.5,
            address: "Munnar-Kodaikanal Boundary, Munnar, Kerala",
            imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
            reviewCount: 18900,
            reviewSnippet: "Magnificent cloud-level view. Clear mornings offer the best panorama of the valleys below."
          },
          {
            id: 201,
            destinationName: "Munnar",
            category: "RESTAURANTS",
            title: "Rapsy Restaurant",
            description: "Iconic restaurant in Munnar bazaar famous for Kerala parottas, beef fry, and chicken meals.",
            rating: 4.2,
            address: "Main Bazaar, Munnar, Kerala",
            imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80",
            reviewCount: 12450,
            reviewSnippet: "Amazing Kerala parottas, beef fry and traditional chicken biryani. Very budget friendly!"
          },
          {
            id: 202,
            destinationName: "Munnar",
            category: "RESTAURANTS",
            title: "Saravana Bhavan",
            description: "Popular pure vegetarian hotel serving South Indian breakfast, full meals, and filter coffee.",
            rating: 4.1,
            address: "Munnar Town, Munnar, Kerala",
            imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80",
            reviewCount: 8920,
            reviewSnippet: "Best vegetarian meals, crispy ghee roast dosas, and filter coffee in Munnar town."
          },
          {
            id: 301,
            destinationName: "Marayoor",
            category: "PARKS",
            title: "Marayoor Sandalwood Forest & Jaggery Farm",
            description: "Famous sandalwood forests, rock paintings, and local jaggery production units.",
            rating: 4.4,
            address: "Marayoor, Western Ghats Road",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
            reviewCount: 6200,
            reviewSnippet: "The aroma of sandalwood forests is refreshing. Famous local jaggery stalls nearby are a must try!"
          },
          {
            id: 302,
            destinationName: "Chinnar",
            category: "PARKS",
            title: "Chinnar Wildlife Sanctuary",
            description: "Lush reserve forest area known for grizzly giant squirrels, deer, and beautiful roads.",
            rating: 4.5,
            address: "Chinnar Forest Office, Pollachi-Munnar Rd",
            imageUrl: "https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&w=600&q=80",
            reviewCount: 7800,
            reviewSnippet: "Beautiful forest drive with sightings of deer and peacocks. Keep windows closed!"
          }
        ];
      } else {
        list = [
          {
            id: 1,
            destinationName: dest,
            category: "ATTRACTIONS",
            title: "Taj Mahal & Heritage Complex",
            description: "The iconic white marble mausoleum, globally recognized as a monument of love and architectural marvel.",
            rating: 4.9,
            address: `Agra, Uttar Pradesh, India`,
            imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
            reviewCount: 185000,
            reviewSnippet: "Stunningly beautiful! Seeing the sunrise over the white marble of the Taj Mahal is a lifetime experience."
          },
          {
            id: 2,
            destinationName: dest,
            category: "RESTAURANTS",
            title: "Punjab Dhaba & Curry House",
            description: "Highly rated authentic roadside dhaba serving slow-cooked dal makhani, butter paneer, and hot garlic naan.",
            rating: 4.6,
            address: `GT Road, NH 1, India`,
            imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
            reviewCount: 12400,
            reviewSnippet: "Amazing butter chicken and slow-cooked dal makhani. Very traditional taste and huge portions!"
          },
          {
            id: 3,
            destinationName: dest,
            category: "MUSEUMS",
            title: "National Indian Heritage Museum",
            description: "Vast gallery housing artifacts from ancient Indus Valley civilizations, royal weaponry, and paintings.",
            rating: 4.5,
            address: `Janpath Road, New Delhi, India`,
            imageUrl: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=600&q=80",
            reviewCount: 8250,
            reviewSnippet: "Fascinating walk through thousands of years of Indian history. The Harappan civilization gallery is a must see."
          },
          {
            id: 4,
            destinationName: dest,
            category: "PARKS",
            title: "Sanjay Gandhi National Park & Reserves",
            description: "Lush tropical green forest reserve featuring ancient rock-cut Kanheri Caves and tiger safaris.",
            rating: 4.4,
            address: `Borivali East, Mumbai, Maharashtra`,
            imageUrl: "https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&w=600&q=80",
            reviewCount: 14300,
            reviewSnippet: "A peaceful green escape right inside the metropolis. Exploring the ancient Buddhist caves is highly recommended."
          }
        ];
      }
      return list.filter(r => !category || category === 'ALL' || r.category === category);
    }
  }
};
