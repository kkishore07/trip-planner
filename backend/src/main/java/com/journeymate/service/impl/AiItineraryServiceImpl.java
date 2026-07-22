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

        String fromP = (trip.getFromPlace() != null && !trip.getFromPlace().isBlank()) ? trip.getFromPlace().trim() : "";
        String fromLower = fromP.toLowerCase();

        boolean isMunnarRoute = destLower.contains("munnar") || (fromLower.contains("coimbatore") && destLower.contains("munnar"));
        boolean isOotyRoute = destLower.contains("ooty") || (fromLower.contains("bangalore") && destLower.contains("ooty"));
        boolean isJaipurRoute = destLower.contains("jaipur") || (fromLower.contains("delhi") && destLower.contains("jaipur"));
        boolean isLonavalaRoute = destLower.contains("lonavala") || (fromLower.contains("mumbai") && destLower.contains("lonavala"));

        for (int day = 1; day <= duration; day++) {
            ItineraryItem item = new ItineraryItem();
            item.setTrip(trip);
            item.setDayNumber(day);
            item.setEstimatedCost(dailyBudget);

            if (isMunnarRoute) {
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
            } else if (isOotyRoute) {
                if (day == 1) {
                    item.setSuggestedTiming("05:00 AM - 08:30 PM");
                    item.setTitle("Scenic Hill Roadtrip from Bangalore to Ooty");
                    item.setDescription("Travel from Bangalore through the historic city of Mysore, cross the Bandipur tiger reserve forest, and ascend to Ooty via Pykara Lake.");
                    item.setActivities("Wildlife Spotting, Mysore Palace Visit, Boating, Pykara Waterfalls Photography");
                    item.setRestaurants("Mylari Hotel (⭐ 4.4), Nahar Restaurant (⭐ 4.1), Earl's Secret (⭐ 4.5)");
                    item.setAttractions("Mysore Palace, Bandipur National Park, Pykara Waterfalls, Ooty Lake");

                    String ootyTimeline = "[" +
                        "{\"time\": \"05:00 AM\", \"title\": \"Leave Bangalore\", \"details\": \"Depart early to beat the city traffic and enjoy the cool morning drive on the Mysore Expressway.\"}," +
                        "{\"time\": \"07:30 AM\", \"title\": \"Breakfast at Mysore\", \"details\": \"Stop at the famous Mylari Hotel (⭐ 4.4 based on Google reviews) for their legendary soft butter idlis and filter coffee.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"Bandipur National Park Drive\", \"details\": \"Enter the forest stretch. Drive slow. Keep an eye out for elephants, deer, and peacocks crossing the road.\"}," +
                        "{\"time\": \"12:30 PM\", \"title\": \"Pykara Waterfalls & Lake\", \"details\": \"Stop at Pykara for a scenic short walk to the waterfalls and optional speedboat rides on the lake.\"}," +
                        "{\"time\": \"02:00 PM\", \"title\": \"Reach Ooty & Lunch\", \"details\": \"Arrive in Ooty. Enjoy a traditional North/South Indian lunch at Nahar Restaurant (⭐ 4.1, 8,920 reviews).\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Ooty Botanical Garden\", \"details\": \"Explore the lush 55-hectare gardens featuring rare trees, fossil trunks, and beautiful glass houses.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Ooty Lake & Boating\", \"details\": \"Relax with a quiet rowboat ride on the scenic Ooty Lake as the sun goes down.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Dinner at Earl's Secret\", \"details\": \"Dine in a gorgeous glasshouse restaurant at Earl's Secret (⭐ 4.5, 3,450 Google reviews) inside a colonial heritage hotel.\"}" +
                        "]";
                    item.setTimelineJson(ootyTimeline);
                } else {
                    item.setSuggestedTiming("08:30 AM - 06:30 PM");
                    item.setTitle("Day " + day + ": Ooty Heritage Toy Train & Coonoor Tour");
                    item.setDescription("Take the historic UNESCO Nilgiri Mountain Railway Toy Train from Ooty to Coonoor and explore Dolphin's Nose and tea processing units.");
                    item.setActivities("UNESCO Toy Train Ride, Tea Factory Tour, Scenic Viewpoint Hike");
                    item.setRestaurants("Cafe Diem (⭐ 4.4), Quality Restaurant");
                    item.setAttractions("Nilgiri Mountain Railway, Dolphin's Nose, Sim's Park, Tea Factory");

                    String ootyDay2 = "[" +
                        "{\"time\": \"08:30 AM\", \"title\": \"Ooty Toy Train Ride\", \"details\": \"Board the famous steam Toy Train from Ooty station to Coonoor. Enjoy scenic valleys, tunnels, and stone bridges.\"}," +
                        "{\"time\": \"10:30 AM\", \"title\": \"Sim's Park & Botanical Walks\", \"details\": \"Stroll in Sim's Park in Coonoor, showcasing unique plant species and terraced landscaping.\"}," +
                        "{\"time\": \"12:00 PM\", \"title\": \"Dolphin's Nose Viewpoint\", \"details\": \"Drive to Dolphin's Nose for a breathtaking view of Catherine Falls and the valley.\"}," +
                        "{\"time\": \"01:30 PM\", \"title\": \"Lunch at Cafe Diem\", \"details\": \"Enjoy vegetarian organic dishes with spectacular valley views at Cafe Diem (⭐ 4.4, 2,120 Google reviews).\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Highfield Tea Factory\", \"details\": \"Observe how tea leaves are processed and try tea tasting of fresh chocolate and masala teas.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Return to Ooty & Leisure\", \"details\": \"Stroll around Ooty Charing Cross market for local eucalyptus oil and homemade chocolates.\"}" +
                        "]";
                    item.setTimelineJson(ootyDay2);
                }
            } else if (isJaipurRoute) {
                if (day == 1) {
                    item.setSuggestedTiming("06:00 AM - 09:30 PM");
                    item.setTitle("Delhi to Jaipur - The Pink City Roadtrip");
                    item.setDescription("Drive from Delhi through Haryana to Rajasthan. Tour the spectacular Amber Fort, Jal Mahal, and finish with a traditional Rajasthani dinner show.");
                    item.setActivities("Fort Guided Tour, Stepwell Photography, Rajasthani Folk Show, Camel Ride");
                    item.setRestaurants("Neemrana Fort Restaurant (⭐ 4.5), Laxmi Mishthan Bhandar (LMB) (⭐ 4.0), Chokhi Dhani (⭐ 4.3)");
                    item.setAttractions("Neemrana Fort, Amber Fort, Jal Mahal, Chokhi Dhani");

                    String jaipurTimeline = "[" +
                        "{\"time\": \"06:00 AM\", \"title\": \"Depart Delhi\", \"details\": \"Start early from Delhi to beat the Gurgaon Expressway traffic.\"}," +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Neemrana Fort Palace\", \"details\": \"Have a royal breakfast at the stunning 15th-century Neemrana Fort Palace (⭐ 4.5 Google reviews) overlooking the hills.\"}," +
                        "{\"time\": \"12:00 PM\", \"title\": \"Stop at Chand Baori Stepwell\", \"details\": \"Take a short detour to see Abhaneri's Chand Baori, one of the deepest and largest stepwells in India.\"}," +
                        "{\"time\": \"02:00 PM\", \"title\": \"Reach Jaipur & Lunch\", \"details\": \"Arrive in Jaipur and check in. Head for a delicious lunch at Laxmi Mishthan Bhandar (LMB) (⭐ 4.0, 15,230 reviews) for authentic Rajasthani Thali.\"}," +
                        "{\"time\": \"04:00 PM\", \"title\": \"Amber Fort Tour\", \"details\": \"Explore the massive Amber Fort, its beautiful Sheesh Mahal (mirror palace), and take in the panoramic mountain views.\"}," +
                        "{\"time\": \"06:30 PM\", \"title\": \"Sunset view at Jal Mahal\", \"details\": \"Stop for photos of Jal Mahal, the floating palace, reflecting in the Mansagar Lake during sunset.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Dinner at Chokhi Dhani\", \"details\": \"Experience Rajasthani village culture, puppet shows, camel rides, and traditional dining at Chokhi Dhani (⭐ 4.3, 28,450 Google reviews).\"}" +
                        "]";
                    item.setTimelineJson(jaipurTimeline);
                } else {
                    item.setSuggestedTiming("09:00 AM - 06:00 PM");
                    item.setTitle("Day " + day + ": Jaipur City Palace & Astronomical Observatory");
                    item.setDescription("Explore Hawa Mahal, City Palace, and the Jantar Mantar observatory in Jaipur.");
                    item.setActivities("Historical Palace Tour, Ancient Instrument Viewing, Local Crafts Shopping");
                    item.setRestaurants("Tapri Central, Peacock Rooftop Restaurant");
                    item.setAttractions("Hawa Mahal, City Palace, Jantar Mantar, Johari Bazaar");

                    String jaipurDay2 = "[" +
                        "{\"time\": \"09:00 AM\", \"title\": \"Hawa Mahal Photos\", \"details\": \"Visit the iconic Palace of Winds early in the morning for best lighting.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"City Palace Museum\", \"details\": \"Explore courtyards, museums, royal armory, and gorgeous doorways.\"}," +
                        "{\"time\": \"12:30 PM\", \"title\": \"Jantar Mantar Observatory\", \"details\": \"Learn about the UNESCO-listed astronomical sundials and instruments.\"}," +
                        "{\"time\": \"02:00 PM\", \"title\": \"Peacock Rooftop Lunch\", \"details\": \"Enjoy local Rajasthani curries at Peacock Rooftop Restaurant (⭐ 4.4).\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Johari Bazaar Shopping\", \"details\": \"Shop for traditional blue pottery, jaipuri quilts, and bandhani clothing.\"}," +
                        "{\"time\": \"05:30 PM\", \"title\": \"Tea at Tapri Central\", \"details\": \"Cozy rooftop tea bar Tapri (⭐ 4.6) for chai, bun-maska, and sunset views.\"}" +
                        "]";
                    item.setTimelineJson(jaipurDay2);
                }
            } else if (isLonavalaRoute) {
                if (day == 1) {
                    item.setSuggestedTiming("07:00 AM - 08:30 PM");
                    item.setTitle("Mumbai to Lonavala - Western Ghats Monsoon Escape");
                    item.setDescription("Drive from Mumbai via the scenic Pune Expressway to the mist-filled hills of Lonavala. Explore historic rock-cut caves and view gorgeous waterfalls.");
                    item.setActivities("Expressway Scenic Drive, Cave Exploration, Viewpoint Trekking, Fudge Tasting");
                    item.setRestaurants("Sunny Da Dhaba (⭐ 4.1), Cooper's Fudge (⭐ 4.3), German Bakery Lonavala");
                    item.setAttractions("Khandala Ghat, Karla Caves, Tiger's Point, Bhushi Dam");

                    String lonavalaTimeline = "[" +
                        "{\"time\": \"07:00 AM\", \"title\": \"Leave Mumbai\", \"details\": \"Start from Mumbai and climb the scenic Mumbai-Pune Expressway.\"}," +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Sunny Da Dhaba\", \"details\": \"Stop at Sunny Da Dhaba (⭐ 4.1 Google reviews) for hot stuffed parathas and sweet lassi.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"Karla Caves Exploration\", \"details\": \"Hike up to the ancient 2nd century BC Buddhist rock-cut shrines, featuring grand pillars and arched ceilings.\"}," +
                        "{\"time\": \"12:00 PM\", \"title\": \"Tiger's Point Viewpoint\", \"details\": \"Head to Tiger's Point for a stunning view of steep valleys, waterfalls, and mist-laden mountains. Enjoy hot corn pakodas.\"}," +
                        "{\"time\": \"01:30 PM\", \"title\": \"Lunch at Cooper's Fudge\", \"details\": \"Enjoy delicious lunch followed by purchase of their legendary chocolate walnut fudge at Cooper's Fudge (⭐ 4.3, 4,920 reviews).\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Bhushi Dam\", \"details\": \"Splash around and relax on the steps of Bhushi Dam with cascading water streams.\"}," +
                        "{\"time\": \"05:30 PM\", \"title\": \"Sunset at Lion's Point\", \"details\": \"Watch the sunset paint the Western Ghats orange from Lion's Point viewpoint.\"}," +
                        "{\"time\": \"07:30 PM\", \"title\": \"Return Journey to Mumbai\", \"details\": \"Drive back to Mumbai via the Expressway, arriving by 9:00 PM.\"}" +
                        "]";
                    item.setTimelineJson(lonavalaTimeline);
                } else {
                    item.setSuggestedTiming("09:00 AM - 05:00 PM");
                    item.setTitle("Day " + day + ": Lonavala Nature & Fort Sightseeing");
                    item.setDescription("Visit Lohagad Fort and Bhaja Caves for ancient architectural scenery.");
                    item.setActivities("Fort Trekking, Cave Photography, Lake Sightseeing");
                    item.setRestaurants("Rama Krishna Restaurant, Kinara Village Dhaba");
                    item.setAttractions("Lohagad Fort, Bhaja Caves, Pawna Lake");

                    String lonavalaDay2 = "[" +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Stay\", \"details\": \"Enjoy hot maharashtrian poha or misal pav.\"}," +
                        "{\"time\": \"09:30 AM\", \"title\": \"Lohagad Fort Trek\", \"details\": \"Trek up to Lohagad Fort, the iron fort of Shivaji. Enjoy stunning mountain trails.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Lunch at Rama Krishna\", \"details\": \"Delicious Punjabi and South Indian food in Lonavala Town.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Bhaja Caves visit\", \"details\": \"Explore Buddhist caves with beautiful stupas and carvings.\"}," +
                        "{\"time\": \"04:30 PM\", \"title\": \"Pawna Lake Sunset\", \"details\": \"Sit by the peaceful shores of Pawna Lake for a beautiful sunset view.\"}" +
                        "]";
                    item.setTimelineJson(lonavalaDay2);
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
