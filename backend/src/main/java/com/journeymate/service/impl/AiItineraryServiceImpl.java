package com.journeymate.service.impl;

import com.journeymate.dto.TripDTOs;
import com.journeymate.entity.ItineraryItem;
import com.journeymate.entity.Trip;
import com.journeymate.service.AiItineraryService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class AiItineraryServiceImpl implements AiItineraryService {

    @Override
    public List<ItineraryItem> generateItineraryForTrip(Trip trip, TripDTOs.GenerateItineraryRequest request) {
        List<ItineraryItem> items = new ArrayList<>();
        int duration = request.getDurationDays() != null ? request.getDurationDays() : 3;
        String dest = trip.getDestination();
        String destLower = dest.toLowerCase();
        BigDecimal dailyBudget = trip.getBudget().divide(BigDecimal.valueOf(duration), 2, RoundingMode.HALF_UP);

        boolean isMunnarOrCoimbatore = destLower.contains("munnar") || destLower.contains("coimbatore") || destLower.contains("pollachi");

        for (int day = 1; day <= duration; day++) {
            ItineraryItem item = new ItineraryItem();
            item.setTrip(trip);
            item.setDayNumber(day);
            item.setEstimatedCost(dailyBudget);

            if (isMunnarOrCoimbatore) {
                if (day == 1) {
                    item.setSuggestedTiming("04:30 AM - 09:30 PM");
                    item.setTitle("Scenic Roadtrip from Coimbatore to Munnar");
                    item.setDescription("Travel from Coimbatore through Chinnar Wildlife Sanctuary forest stretch, stop at Marayoor sandalwood forests, and explore Munnar's iconic tea gardens and viewpoints.");
                    item.setActivities("Scenic Forest Drive, Tea Garden Walk, Viewpoint Photos, Sandalwood Forest Sightseeing");
                    item.setRestaurants("Rapsy Restaurant (⭐ 4.2), Saravana Bhavan (⭐ 4.1), SN Restaurant");
                    item.setAttractions("Tea Gardens, Mattupetty Dam, Echo Point, Top Station, Chinnar Sanctuary");

                    String munnarTimeline = "[" +
                        "{\"time\": \"04:30 AM\", \"title\": \"Leave Coimbatore\", \"details\": \"Carry water, snacks, sunglasses, and a light jacket for the cool hill weather.\"}," +
                        "{\"time\": \"06:15 AM\", \"title\": \"Breakfast at Pollachi or Udumalpet\", \"details\": \"Enjoy local South Indian delicacies like soft idlis, crispy dosas, and hot filter coffee.\"}," +
                        "{\"time\": \"08:15 AM\", \"title\": \"Chinnar Forest stretch entry\", \"details\": \"Beautiful winding roads. Drive slow, watch for deer, peacocks, and monkeys. Avoid stopping where prohibited.\"}," +
                        "{\"time\": \"09:00 AM\", \"title\": \"Marayoor Stop & Tea Break\", \"details\": \"Take a tea break. Famous for sandalwood forests and pure organic jaggery making units.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"Reach Munnar Hills\", \"details\": \"Arrive in Munnar. Visit: 1. Tea Gardens (30-45 min), 2. Mattupetty Dam (45 min - scenic boating), 3. Echo Point (30 min), 4. Top Station (45-60 min - panoramic viewpoint).\"}," +
                        "{\"time\": \"01:30 PM\", \"title\": \"Lunch at Munnar Town\", \"details\": \"Try Kerala meals/biryani at Rapsy Restaurant, vegetarian specialties at Saravana Bhavan, or local treats at SN Restaurant.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Start Return Journey\", \"details\": \"Drive back towards Coimbatore. Optional 15-minute quick stop at Marayoor to purchase fresh jaggery or spices.\"}," +
                        "{\"time\": \"06:30 PM\", \"title\": \"Dinner Stop at Pollachi\", \"details\": \"Enjoy a traditional Tamil Nadu style dinner at Pollachi (6:30 - 7:30 PM).\"}," +
                        "{\"time\": \"09:00 PM\", \"title\": \"Reach Coimbatore\", \"details\": \"Arrive back in Coimbatore by 9:00 - 9:30 PM, ending your memorable hill station day trip.\"}" +
                        "]";
                    item.setTimelineJson(munnarTimeline);
                } else {
                    item.setSuggestedTiming("09:00 AM - 06:00 PM");
                    item.setTitle("Day " + day + ": Munnar Local Sightseeing & Waterfalls");
                    item.setDescription("Explore Eravikulam National Park, tea museums, and scenic waterfalls in Munnar.");
                    item.setActivities("Wildlife Spotting (Nilgiri Tahr), Tea Processing Tour, Waterfall Photos");
                    item.setRestaurants("Copper Castle Restaurant, Rapsy Restaurant");
                    item.setAttractions("Eravikulam National Park, Lakkam Waterfalls, Tea Museum");

                    String day2Timeline = "[" +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Hotel\", \"details\": \"Breakfast at your stay or local town cafe.\"}," +
                        "{\"time\": \"09:30 AM\", \"title\": \"Eravikulam National Park\", \"details\": \"Spot the rare Nilgiri Tahr goat species and climb to scenic viewpoints.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Lunch at Tea Valley\", \"details\": \"Traditional meals with a valley view.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Munnar Tea Museum\", \"details\": \"Learn about history of tea cultivation and machinery in Munnar.\"}," +
                        "{\"time\": \"04:30 PM\", \"title\": \"Lakkam Waterfalls\", \"details\": \"Scenic waterfall surrounded by forest. Clean and refreshing water flow.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Return to Town / Evening Leisure\", \"details\": \"Local shopping for homemade chocolates, tea, and spices.\"}" +
                        "]";
                    item.setTimelineJson(day2Timeline);
                }
            } else {
                // Generic beautiful timeline
                item.setSuggestedTiming("09:00 AM - 08:30 PM");
                if (day == 1) {
                    item.setTitle("Arrival & City Orientation of " + dest);
                    item.setDescription("Get familiar with " + dest + ", visit its central square, and experience a local sunset view.");
                    item.setActivities("Hotel Check-in, Neighborhood Walk, Sunset Viewpoint");
                    item.setRestaurants("Grand Landmark Bistro, Local Heritage Grill");
                    item.setAttractions("Historic Old Town, Central Plaza, Main Cathedral");

                    String timeline = "[" +
                        "{\"time\": \"09:00 AM\", \"title\": \"Arrival & Hotel Check-in\", \"details\": \"Settle in your hotel and refresh for the city exploration.\"}," +
                        "{\"time\": \"11:00 AM\", \"title\": \"Walk around Central Plaza\", \"details\": \"Explore the historic heart of the city, architecture, and beautiful fountains.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Welcome Lunch at Bistro\", \"details\": \"Taste authentic local dishes at highly rated Grand Landmark Bistro (⭐ 4.8 based on Google reviews).\"}," +
                        "{\"time\": \"03:00 PM\", \"title\": \"Historic Cathedral Tour\", \"details\": \"Visit the main iconic cathedral, admire the stained glass windows, and climb the tower.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Sunset Viewpoint Climb\", \"details\": \"Walk up to the town's highest hill for a panoramic evening sunset vista.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Traditional Welcome Dinner\", \"details\": \"Enjoy local cuisine accompanied by acoustic music at Local Heritage Grill.\"}" +
                        "]";
                    item.setTimelineJson(timeline);
                } else if (day == 2) {
                    item.setTitle("Cultural Immersive Day in " + dest);
                    item.setDescription("Explore museums, traditional arts, markets, and scenic neighborhood spots.");
                    item.setActivities("National Museum Visit, Local Food Tasting Tour, Park Walk");
                    item.setRestaurants("Heritage Dining Room, Street Food Haven");
                    item.setAttractions("Art Gallery, Botanic Gardens, Waterfront Promenade");

                    String timeline = "[" +
                        "{\"time\": \"09:00 AM\", \"title\": \"Morning Coffee & Pastry\", \"details\": \"Start your day at a cozy neighborhood cafe.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"National Museum Tour\", \"details\": \"Exquisite exhibition of history, artifacts, and modern art pieces.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Food Tasting Tour\", \"details\": \"Sample 5 different local street food items in the old market alleys.\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Botanical Gardens Promenade\", \"details\": \"Tranquil lake walk, glass greenhouse visit, and swan spotting.\"}," +
                        "{\"time\": \"06:30 PM\", \"title\": \"Waterfront Stroll\", \"details\": \"Catch the cool breeze along the main harbor promenade.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Seaside Seafood Dinner\", \"details\": \"Fresh catch of the day at Heritage Dining Room (⭐ 4.7 Google reviews).\"}" +
                        "]";
                    item.setTimelineJson(timeline);
                } else {
                    item.setTitle("Hidden Gems & Adventure in " + dest);
                    item.setDescription("Discover off-the-beaten-path cafes, artisan shops, and scenic local activities.");
                    item.setActivities("Artisan Workshop, Boutique Shopping, Sunset Evening Cruise");
                    item.setRestaurants("Rooftop Skyline Bar, Sunset Lounge");
                    item.setAttractions("Hidden Garden, Historic Library, Harbor Wharf");

                    String timeline = "[" +
                        "{\"time\": \"09:30 AM\", \"title\": \"Artisan Pottery Workshop\", \"details\": \"Try your hands at traditional pottery making at a local artisan shop.\"}," +
                        "{\"time\": \"11:30 AM\", \"title\": \"Boutique & Souvenir Shopping\", \"details\": \"Stroll around handcraft markets for unique authentic souvenirs.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Organic Garden Lunch\", \"details\": \"Farm-to-table lunch at a quiet greenhouse cafe.\"}," +
                        "{\"time\": \"03:00 PM\", \"title\": \"Historic Library Visit\", \"details\": \"Admire centuries-old books, architectural vaults, and quiet reading halls.\"}," +
                        "{\"time\": \"05:30 PM\", \"title\": \"Sunset Cruise & Toast\", \"details\": \"Enjoy a relaxing boat cruise around the harbor with light music and snacks.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Farewell Dinner & Drinks\", \"details\": \"Rooftop drinks and dinner with skyline views at Rooftop Skyline Bar.\"}" +
                        "]";
                    item.setTimelineJson(timeline);
                }
            }

            items.add(item);
        }

        return items;
    }

    @Override
    public String generateChatReply(String userMessage, String destinationContext) {
        String msg = userMessage.toLowerCase();
        String contextStr = (destinationContext != null && !destinationContext.isBlank()) ? " in " + destinationContext : "";

        if (msg.contains("budget") || msg.contains("cost") || msg.contains("money")) {
            return "To optimize your budget" + contextStr + ", consider booking attractions early, using public transportation passes, and sampling popular local street dining!";
        } else if (msg.contains("hotel") || msg.contains("stay") || msg.contains("accommodation")) {
            return "For accommodations" + contextStr + ", staying near central transit hubs or historic downtown offers the best balance of safety and accessibility.";
        } else if (msg.contains("food") || msg.contains("restaurant") || msg.contains("eat")) {
            return "Top culinary recommendations" + contextStr + " include visiting neighborhood food markets and trying local signature dishes for an authentic experience.";
        } else if (msg.contains("weather") || msg.contains("pack") || msg.contains("clothing")) {
            return "Be sure to pack comfortable walking shoes, layer-friendly clothing, and a portable charger when exploring" + contextStr + "!";
        } else {
            return "JourneyMate AI Recommendation" + contextStr + ": Combine famous bucket-list landmarks with quiet morning walks to experience the authentic vibe without crowds!";
        }
    }
}
