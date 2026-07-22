package com.journeymate.service.impl;

import com.journeymate.dto.RecommendationDTOs;
import com.journeymate.service.RecommendationService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Override
    public List<RecommendationDTOs.RecommendationResponse> getRecommendations(String destination, String category) {
        String dest = (destination != null && !destination.isBlank()) ? destination : "Global Top";
        String destLower = dest.toLowerCase();
        List<RecommendationDTOs.RecommendationResponse> list = new ArrayList<>();

        if (destLower.contains("munnar") || destLower.contains("coimbatore") || destLower.contains("pollachi")) {
            // Munnar Attractions
            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(101L)
                    .destinationName("Munnar")
                    .category("ATTRACTIONS")
                    .title("Tea Gardens & Photo Point")
                    .description("Lush green terraced tea estates. Best scenic walk and photography spots in Munnar.")
                    .rating(4.6)
                    .address("Munnar Hills, Munnar, Kerala")
                    .imageUrl("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(24500)
                    .reviewSnippet("The best scenic tea estate walks. Photographers' paradise with emerald slopes!")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(102L)
                    .destinationName("Munnar")
                    .category("ATTRACTIONS")
                    .title("Mattupetty Dam & Lake")
                    .description("Scenic gravity dam and lake surrounded by hills. Speed boating and horse riding are popular.")
                    .rating(4.3)
                    .address("Mattupetty, Munnar, Kerala")
                    .imageUrl("https://images.unsplash.com/photo-1616388968889-aa2f75685a3e?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(15200)
                    .reviewSnippet("Excellent spot for boating and panoramic lake views. Spotted some elephants!")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(103L)
                    .destinationName("Munnar")
                    .category("ATTRACTIONS")
                    .title("Echo Point")
                    .description("A high point where your voice echoes back. Beautiful lake side views and mist-filled hills.")
                    .rating(4.4)
                    .address("Munnar-Top Station Highway, Munnar, Kerala")
                    .imageUrl("https://images.unsplash.com/photo-1593693411515-c202e974eb18?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(9180)
                    .reviewSnippet("Fun spot to shout out and hear the echo! Beautiful surrounding green valleys.")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(104L)
                    .destinationName("Munnar")
                    .category("ATTRACTIONS")
                    .title("Top Station Viewpoint")
                    .description("The highest point in Munnar, offering panoramic views of the Western Ghats if sky is clear.")
                    .rating(4.5)
                    .address("Munnar-Kodaikanal Boundary, Munnar, Kerala")
                    .imageUrl("https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(18900)
                    .reviewSnippet("Magnificent cloud-level view. Clear mornings offer the best panorama of the valleys below.")
                    .build());

            // Munnar Restaurants
            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(201L)
                    .destinationName("Munnar")
                    .category("RESTAURANTS")
                    .title("Rapsy Restaurant")
                    .description("Iconic restaurant in Munnar bazaar famous for Kerala parottas, beef fry, and chicken meals.")
                    .rating(4.2)
                    .address("Main Bazaar, Munnar, Kerala")
                    .imageUrl("https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(12450)
                    .reviewSnippet("Amazing Kerala parottas, beef fry and traditional chicken biryani. Very budget friendly!")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(202L)
                    .destinationName("Munnar")
                    .category("RESTAURANTS")
                    .title("Saravana Bhavan")
                    .description("Popular pure vegetarian hotel serving South Indian breakfast, full meals, and filter coffee.")
                    .rating(4.1)
                    .address("Munnar Town, Munnar, Kerala")
                    .imageUrl("https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(8920)
                    .reviewSnippet("Best vegetarian meals, crispy ghee roast dosas, and filter coffee in Munnar town.")
                    .build());

            // Chinnar & Marayoor (Parks / Attractions)
            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(301L)
                    .destinationName("Marayoor")
                    .category("PARKS")
                    .title("Marayoor Sandalwood Forest & Jaggery Farm")
                    .description("Famous sandalwood forests, rock paintings, and local jaggery production units.")
                    .rating(4.4)
                    .address("Marayoor, Western Ghats Road")
                    .imageUrl("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(6200)
                    .reviewSnippet("The aroma of sandalwood forests is refreshing. Famous local jaggery stalls nearby are a must try!")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(302L)
                    .destinationName("Chinnar")
                    .category("PARKS")
                    .title("Chinnar Wildlife Sanctuary")
                    .description("Lush reserve forest area known for grizzly giant squirrels, deer, and beautiful roads.")
                    .rating(4.5)
                    .address("Chinnar Forest Office, Pollachi-Munnar Rd")
                    .imageUrl("https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(7800)
                    .reviewSnippet("Beautiful forest drive with sightings of deer and peacocks. Keep windows closed!")
                    .build());
        } else {
            // General City Recommendations
            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(1L)
                    .destinationName(dest)
                    .category("ATTRACTIONS")
                    .title("Grand Landmark & Historic Plaza")
                    .description("Top rated tourist landmark offering stunning city architecture and rich heritage tours.")
                    .rating(4.9)
                    .address("Central Boulevard 101, " + dest)
                    .imageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(15200)
                    .reviewSnippet("Absolutely gorgeous at sunset! A must visit historic monument with rich culture.")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(2L)
                    .destinationName(dest)
                    .category("RESTAURANTS")
                    .title("La Gourmandise Bistro")
                    .description("Michelin guide recommended local culinary experience with organic seasonal tasting menu.")
                    .rating(4.8)
                    .address("Avenue De Culinary 45, " + dest)
                    .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(8920)
                    .reviewSnippet("Outstanding tasting menu and the rooftop views are incredible. Highly recommend the chef specials.")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(3L)
                    .destinationName(dest)
                    .category("MUSEUMS")
                    .title("National Art & History Museum")
                    .description("Vast gallery housing world-famous masterpieces, interactive digital exhibits, and sculptures.")
                    .rating(4.7)
                    .address("Museum Square 12, " + dest)
                    .imageUrl("https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(6450)
                    .reviewSnippet("Super informative exhibits. The modern sculpture wing and digital art rooms are a masterpiece.")
                    .build());

            list.add(RecommendationDTOs.RecommendationResponse.builder()
                    .id(4L)
                    .destinationName(dest)
                    .category("PARKS")
                    .title("Serene Botanical Gardens")
                    .description("Lush green park featuring tranquil lakes, exotic flora conservatories, and picnic spots.")
                    .rating(4.9)
                    .address("Parkside Lane 8, " + dest)
                    .imageUrl("https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80")
                    .reviewCount(11200)
                    .reviewSnippet("A peaceful botanical garden. Perfect place to relax with family and take photos of exotic orchids.")
                    .build());
        }

        if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            return list.stream()
                    .filter(r -> r.getCategory().equalsIgnoreCase(category))
                    .toList();
        }

        return list;
    }
}
