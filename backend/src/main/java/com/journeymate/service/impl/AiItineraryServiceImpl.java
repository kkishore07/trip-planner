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

        boolean isBike = trip.getTravelMode() != null && (trip.getTravelMode().equalsIgnoreCase("Bike") || trip.getTravelMode().toLowerCase().contains("bike"));

        boolean isMunnarRoute = destLower.contains("munnar") || (fromLower.contains("coimbatore") && destLower.contains("munnar"));
        boolean isOotyRoute = destLower.contains("ooty") || (fromLower.contains("bangalore") && destLower.contains("ooty"));
        boolean isValparaiRoute = destLower.contains("valparai");
        boolean isJaipurRoute = destLower.contains("jaipur") || (fromLower.contains("delhi") && destLower.contains("jaipur"));
        boolean isLonavalaRoute = destLower.contains("lonavala") || (fromLower.contains("mumbai") && destLower.contains("lonavala"));

        for (int day = 1; day <= duration; day++) {
            ItineraryItem item = new ItineraryItem();
            item.setTrip(trip);
            item.setDayNumber(day);
            item.setEstimatedCost(dailyBudget);

            if (isMunnarRoute) {
                item.setClimateInfo("Mist & Light Rain (Monsoon). Temperature: 16°C - 22°C. Visibility is low in evenings, so plan commutes early.");
                item.setSkipSuggestions("Boating at Mattupetty Dam (skip if raining heavily), Top Station (skip if fog is dense, views will be blocked)");
                if (isBike) {
                    item.setBikerWarnings("Chinnar Checkpost entry for two-wheelers is strictly allowed only between 6:00 AM and 6:00 PM. Make sure to cross Udumalpet before 4:30 PM to avoid being stranded.");
                }

                if (day == 1) {
                    item.setSuggestedTiming(isBike ? "05:30 AM - 05:30 PM" : "04:30 AM - 09:30 PM");
                    item.setTitle("Scenic " + (isBike ? "Bike Ride" : "Roadtrip") + " from Coimbatore to Munnar");
                    item.setDescription("Travel from Coimbatore through Chinnar Wildlife Sanctuary forest stretch, stop at Marayoor sandalwood forests, and explore Munnar's iconic tea gardens and viewpoints.");
                    item.setActivities(isBike ? "Winding Forest Ride, Tea Garden Walk, Viewpoint Photos" : "Scenic Forest Drive, Tea Garden Walk, Viewpoint Photos, Sandalwood Forest Sightseeing");
                    item.setRestaurants("Rapsy Restaurant (⭐ 4.2), Saravana Bhavan (⭐ 4.1), SN Restaurant");
                    item.setAttractions("Tea Gardens (45 mins), Mattupetty Dam (1.5 hours - boating), Echo Point (30 mins), Top Station (1 hour), Chinnar Sanctuary (45 mins)");

                    String munnarTimeline = "[" +
                        "{\"time\": \"05:30 AM\", \"title\": \"Leave Coimbatore\", \"details\": \"Dress in layers. Carry a raincoat and water. If riding a bike, ensure helmet visor is clear.\"}," +
                        "{\"time\": \"07:00 AM\", \"title\": \"Breakfast at Pollachi or Udumalpet\", \"details\": \"Enjoy local South Indian delicacies like soft idlis, crispy dosas, and hot filter coffee.\"}," +
                        "{\"time\": \"08:15 AM\", \"title\": \"Chinnar Forest stretch entry\", \"details\": \"Note: Forest checkpost timing for bikes is 6 AM - 6 PM. Ride slow, watch for elephants, deer, and monkeys. No stopping inside forest zones.\"}," +
                        "{\"time\": \"09:00 AM\", \"title\": \"Marayoor Stop & Tea Break\", \"details\": \"Take a tea break (30 mins). Famous for sandalwood forests and pure organic jaggery making units.\"}," +
                        "{\"time\": \"10:30 AM\", \"title\": \"Reach Munnar Hills\", \"details\": \"Arrive in Munnar. Visit: 1. Tea Gardens (45 min walk), 2. Mattupetty Dam (1.5 hours - boating), 3. Echo Point (30 min).\"}," +
                        "{\"time\": \"01:30 PM\", \"title\": \"Lunch at Munnar Town\", \"details\": \"Try Kerala meals/biryani at Rapsy Restaurant, or vegetarian specialties at Saravana Bhavan.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Start Return Journey / Check-in\", \"details\": \"If a 1-day trip, start return drive to Coimbatore before 3 PM to cross Chinnar checkpost safely by 5 PM. If multi-day, check in to hotel.\"}" +
                        (isBike ? "" : ",\n{\"time\": \"06:30 PM\", \"title\": \"Dinner Stop at Pollachi\", \"details\": \"Enjoy a traditional Tamil Nadu style dinner at Pollachi.\"}," +
                        "\n{\"time\": \"09:00 PM\", \"title\": \"Reach Coimbatore\", \"details\": \"Arrive back in Coimbatore by 9:00 PM, ending your memorable hill station day trip.\"}") +
                        "]";
                    item.setTimelineJson(munnarTimeline);
                } else {
                    item.setSuggestedTiming("09:00 AM - 06:00 PM");
                    item.setTitle("Day " + day + ": Munnar Local Sightseeing & Waterfalls");
                    item.setDescription("Explore Eravikulam National Park, tea museums, and scenic waterfalls in Munnar.");
                    item.setActivities("Wildlife Spotting (Nilgiri Tahr), Tea Processing Tour, Waterfall Photos");
                    item.setRestaurants("Copper Castle Restaurant, Rapsy Restaurant");
                    item.setAttractions("Eravikulam National Park (2.5 hours), Lakkam Waterfalls (1 hour), Tea Museum (1.5 hours)");

                    String day2Timeline = "[" +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Hotel\", \"details\": \"Breakfast at your stay or local town cafe.\"}," +
                        "{\"time\": \"09:30 AM\", \"title\": \"Eravikulam National Park\", \"details\": \"Spot the rare Nilgiri Tahr goat species and climb to scenic viewpoints. Spend 2 to 3 hours.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Lunch at Tea Valley\", \"details\": \"Traditional meals with a valley view.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Munnar Tea Museum\", \"details\": \"Learn about history of tea cultivation and machinery in Munnar. Spend 1.5 hours.\"}," +
                        "{\"time\": \"04:30 PM\", \"title\": \"Lakkam Waterfalls\", \"details\": \"Scenic waterfall surrounded by forest. Clean and refreshing water flow. Spend 1 hour.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Return to Town / Evening Leisure\", \"details\": \"Local shopping for homemade chocolates, tea, and spices.\"}" +
                        "]";
                    item.setTimelineJson(day2Timeline);
                }
            } else if (isOotyRoute) {
                item.setClimateInfo("Cool and cloudy (12°C - 18°C). Periodic light showers. Bring warm woolens and raincoats.");
                item.setSkipSuggestions("Pykara Speedboat (skip during high wind/heavy rain), Doddabetta Peak (skip if fogged out, zero visibility)");
                if (isBike) {
                    item.setBikerWarnings("Bandipur Forest checkpost has a strict night travel ban from 9:00 PM to 6:00 AM. Also, the steep Kalhatty Ghat road is closed for downward two-wheeler traffic (use alternate route via Gudalur for descent).");
                }

                if (day == 1) {
                    item.setSuggestedTiming(isBike ? "06:00 AM - 06:00 PM" : "05:00 AM - 08:30 PM");
                    item.setTitle("Scenic Hill " + (isBike ? "Bike Ride" : "Roadtrip") + " from Bangalore to Ooty");
                    item.setDescription("Travel from Bangalore through the historic city of Mysore, cross the Bandipur tiger reserve forest, and ascend to Ooty via Pykara Lake.");
                    item.setActivities(isBike ? "Forest Wildlife Spotting, Mysore Palace Walk, Pykara Lake stop" : "Wildlife Spotting, Mysore Palace Visit, Boating, Pykara Waterfalls Photography");
                    item.setRestaurants("Mylari Hotel (⭐ 4.4), Nahar Restaurant (⭐ 4.1), Earl's Secret (⭐ 4.5)");
                    item.setAttractions("Mysore Palace (2 hours), Bandipur National Park (1.5 hours), Pykara Waterfalls (1 hour), Ooty Lake (1.5 hours)");

                    String ootyTimeline = "[" +
                        "{\"time\": \"06:00 AM\", \"title\": \"Leave Bangalore\", \"details\": \"Depart early. Wear thermal gear and raincoats if on a bike to beat the cold highway wind.\"}," +
                        "{\"time\": \"08:00 AM\", \"title\": \"Breakfast at Mysore\", \"details\": \"Stop at the famous Mylari Hotel for their legendary soft butter idlis and filter coffee.\"}," +
                        "{\"time\": \"10:30 AM\", \"title\": \"Bandipur Forest crossing\", \"details\": \"Note: Bandipur Forest Checkpost night ban is 9 PM - 6 AM. Drive/ride slowly. Avoid blowing horn or stopping.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Pykara Waterfalls & Lake\", \"details\": \"Stop at Pykara for a scenic short walk to the waterfalls (1 hour) and optional speedboat rides on the lake.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Reach Ooty & Lunch\", \"details\": \"Arrive in Ooty. Enjoy a traditional lunch at Nahar Restaurant.\"}," +
                        "{\"time\": \"04:00 PM\", \"title\": \"Ooty Botanical Garden\", \"details\": \"Explore the lush 55-hectare gardens featuring rare trees, fossil trunks, and beautiful glass houses. Spend 1.5 hours.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Ooty Lake & Check-in\", \"details\": \"Relax by the lake or check-in to hotel. Avoid two-wheeler riding late after dark due to animal crossings and fog.\"}" +
                        "]";
                    item.setTimelineJson(ootyTimeline);
                } else {
                    item.setSuggestedTiming("08:30 AM - 06:30 PM");
                    item.setTitle("Day " + day + ": Ooty Heritage Toy Train & Coonoor Tour");
                    item.setDescription("Take the historic UNESCO Nilgiri Mountain Railway Toy Train from Ooty to Coonoor and explore Dolphin's Nose and tea processing units.");
                    item.setActivities("UNESCO Toy Train Ride, Tea Factory Tour, Scenic Viewpoint Hike");
                    item.setRestaurants("Cafe Diem (⭐ 4.4), Quality Restaurant");
                    item.setAttractions("Nilgiri Mountain Railway (2 hours), Dolphin's Nose (45 mins), Sim's Park (1 hour), Highfield Tea Factory (1.5 hours)");

                    String ootyDay2 = "[" +
                        "{\"time\": \"08:30 AM\", \"title\": \"Ooty Toy Train Ride\", \"details\": \"Board the famous steam Toy Train from Ooty station to Coonoor. Enjoy scenic valleys, tunnels, and stone bridges. Spend 2 hours.\"}," +
                        "{\"time\": \"10:30 AM\", \"title\": \"Sim's Park & Botanical Walks\", \"details\": \"Stroll in Sim's Park in Coonoor, showcasing unique plant species. Spend 1 hour.\"}," +
                        "{\"time\": \"12:00 PM\", \"title\": \"Dolphin's Nose Viewpoint\", \"details\": \"Drive/ride to Dolphin's Nose for a breathtaking view of Catherine Falls and the valley. Spend 45 mins.\"}," +
                        "{\"time\": \"01:30 PM\", \"title\": \"Lunch at Cafe Diem\", \"details\": \"Enjoy vegetarian organic dishes with spectacular valley views at Cafe Diem.\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Highfield Tea Factory\", \"details\": \"Observe how tea leaves are processed and try tea tasting of fresh chocolate and masala teas. Spend 1.5 hours.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Return to Ooty & Leisure\", \"details\": \"Stroll around Ooty Charing Cross market for local eucalyptus oil and homemade chocolates.\"}" +
                        "]";
                    item.setTimelineJson(ootyDay2);
                }
            } else if (isValparaiRoute) {
                item.setClimateInfo("High humidity & heavy mist (18°C - 24°C). Frequent afternoon rain. Watching hairpin curves is critical.");
                item.setSkipSuggestions("Monkey Falls (skip if heavy rain/flash floods warned), Loam's Viewpoint (skip if dense fog completely covers the valley)");
                if (isBike) {
                    item.setBikerWarnings("Aliyar Checkpost closes for two-wheelers at 6:00 PM. Two-wheelers should watch out for wild elephant herds near hairpin bends 20 to 30. Ride carefully in lower gear.");
                }

                if (day == 1) {
                    item.setSuggestedTiming(isBike ? "06:00 AM - 05:00 PM" : "06:00 AM - 07:00 PM");
                    item.setTitle("Scenic Hill Climb to Valparai");
                    item.setDescription("Ride/drive from Coimbatore through the Aliyar forest checkpost, climb the 40 spectacular hairpin bends, stop at Loam's Viewpoint, and enjoy the tea gardens of Valparai.");
                    item.setActivities("Forest Road Ride, Hairpin Bend Cornering, Viewpoint Photos, Tea Estate Walk");
                    item.setRestaurants("Valparai Mess, Sri Lakshmi Chettinad Restaurant");
                    item.setAttractions("Aliyar Dam (1 hour), Loam's Viewpoint (20 mins), Monkey Falls (1 hour), Sholayar Dam (1 hour)");

                    String valparaiTimeline = "[" +
                        "{\"time\": \"06:00 AM\", \"title\": \"Leave Coimbatore\", \"details\": \"Depart early. Wear a windcheater. Ensure bike fuel and brakes are checked before the climb.\"}," +
                        "{\"time\": \"07:30 AM\", \"title\": \"Breakfast at Pollachi\", \"details\": \"Enjoy fresh local breakfast at Pollachi before beginning the hill climb.\"}," +
                        "{\"time\": \"08:30 AM\", \"title\": \"Aliyar Checkpost Crossing\", \"details\": \"Checkpost timing: 6 AM - 6 PM. Cross early. Monkey Falls is nearby.\"}," +
                        "{\"time\": \"09:00 AM\", \"title\": \"Monkey Falls Stop\", \"details\": \"Natural waterfall. Spend 1 hour. Watch out for monkeys around your vehicle/gear!\"}," +
                        "{\"time\": \"10:15 AM\", \"title\": \"Loam's Viewpoint (Hairpin Bend 9)\", \"details\": \"Stop for 20 mins. Panoramic view of Aliyar reservoir and surrounding hills.\"}," +
                        "{\"time\": \"11:30 AM\", \"title\": \"Climb the 40 Hairpin Bends\", \"details\": \"Ride slowly in lower gears. Keep left on blind corners. Watch for elephants crossing.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Reach Valparai Town & Lunch\", \"details\": \"Traditional Tamil lunch at Valparai Mess or Sri Lakshmi Chettinad.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Sholayar Dam Visit\", \"details\": \"One of the tallest active dams in Asia. Spend 1 hour. Enjoy the massive lake view.\"}," +
                        "{\"time\": \"04:30 PM\", \"title\": \"Estate Check-in & Tea\", \"details\": \"Evening tea and relaxation at your tea estate bungalow.\"}" +
                        "]";
                    item.setTimelineJson(valparaiTimeline);
                } else {
                    item.setSuggestedTiming("09:00 AM - 05:00 PM");
                    item.setTitle("Day " + day + ": Valparai Wildlife & Tea Estates");
                    item.setDescription("Explore Balaji Temple, Nallamudi Poonjolai viewpoint, and try spotting the endemic Nilgiri Tahr goat.");
                    item.setActivities("Tea Garden Walks, Viewpoint Hiking, Wildlife Photography");
                    item.setRestaurants("Hotel Green Hill Restaurant, Estate Diner");
                    item.setAttractions("Balaji Temple (1 hour), Nallamudi Poonjolai Viewpoint (1.5 hours), Karamalai Annai Church (45 mins)");

                    String valDay2 = "[" +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Stay\", \"details\": \"Breakfast at estate stay.\"}," +
                        "{\"time\": \"09:30 AM\", \"title\": \"Balaji Temple Visit\", \"details\": \"Beautiful temple situated inside private tea estates. Peaceful atmosphere. Spend 1 hour.\"}," +
                        "{\"time\": \"11:30 AM\", \"title\": \"Karamalai Annai Church\", \"details\": \"Historical church surrounded by tea estates. Spend 45 mins.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Lunch in Town\", \"details\": \"Taste hot chettinad curries at local hotels.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Nallamudi Poonjolai Viewpoint\", \"details\": \"Walk through tea bushes to reach the viewpoint facing Anamudi peak. Spot Nilgiri Tahr. Spend 1.5 hours.\"}," +
                        "{\"time\": \"04:30 PM\", \"title\": \"Iyerpadi Tea Factory Visit\", \"details\": \"Learn about tea leaf plucking and green tea processing (1 hour).\"}" +
                        "]";
                    item.setTimelineJson(valDay2);
                }
            } else if (isJaipurRoute) {
                item.setClimateInfo("Dry and warm (28°C - 35°C). Sunshine is direct. Stay hydrated and wear sunglasses.");
                item.setSkipSuggestions("Jal Mahal camel rides during midday heat (skip to prevent heatstroke), open street markets in noon");
                if (isBike) {
                    item.setBikerWarnings("NH48 highway has heavy truck traffic. Avoid driving at night, ensure helmet visors are clean of dust, and wear riding jacket/gloves.");
                }

                if (day == 1) {
                    item.setSuggestedTiming("06:00 AM - 09:30 PM");
                    item.setTitle("Delhi to Jaipur - The Pink City Roadtrip");
                    item.setDescription("Drive from Delhi through Haryana to Rajasthan. Tour the spectacular Amber Fort, Jal Mahal, and finish with a traditional Rajasthani dinner show.");
                    item.setActivities("Fort Guided Tour, Stepwell Photography, Rajasthani Folk Show, Camel Ride");
                    item.setRestaurants("Neemrana Fort Restaurant (⭐ 4.5), Laxmi Mishthan Bhandar (LMB) (⭐ 4.0), Chokhi Dhani (⭐ 4.3)");
                    item.setAttractions("Neemrana Fort (2 hours), Amber Fort (2.5 hours), Jal Mahal (45 mins), Chokhi Dhani (3 hours)");

                    String jaipurTimeline = "[" +
                        "{\"time\": \"06:00 AM\", \"title\": \"Depart Delhi\", \"details\": \"Start early from Delhi to beat the Gurgaon Expressway traffic.\"}," +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Neemrana Fort Palace\", \"details\": \"Have a royal breakfast at the stunning 15th-century Neemrana Fort Palace (⭐ 4.5 Google reviews) overlooking the hills. Spend 1.5 hours.\"}," +
                        "{\"time\": \"12:00 PM\", \"title\": \"Stop at Chand Baori Stepwell\", \"details\": \"Take a short detour to see Abhaneri's Chand Baori, one of the deepest and largest stepwells in India. Spend 45 mins.\"}," +
                        "{\"time\": \"02:00 PM\", \"title\": \"Reach Jaipur & Lunch\", \"details\": \"Arrive in Jaipur and check in. Head for a delicious lunch at Laxmi Mishthan Bhandar (LMB) for authentic Rajasthani Thali.\"}," +
                        "{\"time\": \"04:00 PM\", \"title\": \"Amber Fort Tour\", \"details\": \"Explore the massive Amber Fort, its beautiful Sheesh Mahal, and take in the panoramic mountain views. Spend 2 hours.\"}," +
                        "{\"time\": \"06:30 PM\", \"title\": \"Sunset view at Jal Mahal\", \"details\": \"Stop for photos of Jal Mahal, the floating palace, reflecting in the Mansagar Lake during sunset. Spend 45 mins.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Dinner at Chokhi Dhani\", \"details\": \"Experience Rajasthani village culture, puppet shows, camel rides, and traditional dining at Chokhi Dhani. Spend 3 hours.\"}" +
                        "]";
                    item.setTimelineJson(jaipurTimeline);
                } else {
                    item.setSuggestedTiming("09:00 AM - 06:00 PM");
                    item.setTitle("Day " + day + ": Jaipur City Palace & Astronomical Observatory");
                    item.setDescription("Explore Hawa Mahal, City Palace, and the Jantar Mantar observatory in Jaipur.");
                    item.setActivities("Historical Palace Tour, Ancient Instrument Viewing, Local Crafts Shopping");
                    item.setRestaurants("Tapri Central, Peacock Rooftop Restaurant");
                    item.setAttractions("Hawa Mahal (45 mins), City Palace (2 hours), Jantar Mantar (1.5 hours), Johari Bazaar (2 hours)");

                    String jaipurDay2 = "[" +
                        "{\"time\": \"09:00 AM\", \"title\": \"Hawa Mahal Photos\", \"details\": \"Visit the iconic Palace of Winds early in the morning for best lighting. Spend 45 mins.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"City Palace Museum\", \"details\": \"Explore courtyards, museums, royal armory, and gorgeous doorways. Spend 2 hours.\"}," +
                        "{\"time\": \"12:30 PM\", \"title\": \"Jantar Mantar Observatory\", \"details\": \"Learn about the UNESCO-listed astronomical sundials and instruments. Spend 1.5 hours.\"}," +
                        "{\"time\": \"02:00 PM\", \"title\": \"Peacock Rooftop Lunch\", \"details\": \"Enjoy local Rajasthani curries at Peacock Rooftop Restaurant.\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Johari Bazaar Shopping\", \"details\": \"Shop for traditional blue pottery, jaipuri quilts, and bandhani clothing. Spend 2 hours.\"}," +
                        "{\"time\": \"05:30 PM\", \"title\": \"Tea at Tapri Central\", \"details\": \"Cozy rooftop tea bar Tapri for chai, bun-maska, and sunset views.\"}" +
                        "]";
                    item.setTimelineJson(jaipurDay2);
                }
            } else if (isLonavalaRoute) {
                item.setClimateInfo("Heavy rains & waterfalls in full flow (Western Ghats monsoon). Clouds cover valleys. Roads are wet and slippery.");
                item.setSkipSuggestions("Bhushi Dam steps (skip if water flow is dangerously high/overcrowded), outdoor trekking during downpours");
                if (isBike) {
                    item.setBikerWarnings("Two-wheelers are strictly banned on the Mumbai-Pune Expressway. Bikers must use the old NH4 highway, which is scenic but has heavy truck traffic.");
                }

                if (day == 1) {
                    item.setSuggestedTiming("07:00 AM - 08:30 PM");
                    item.setTitle("Mumbai to Lonavala - Western Ghats Monsoon Escape");
                    item.setDescription("Drive from Mumbai via the old NH4 highway/Expressway to the mist-filled hills of Lonavala. Explore historic rock-cut caves and view gorgeous waterfalls.");
                    item.setActivities(isBike ? "Old Highway Scenic Ride, Cave Exploration, Fudge Tasting" : "Expressway Scenic Drive, Cave Exploration, Viewpoint Trekking, Fudge Tasting");
                    item.setRestaurants("Sunny Da Dhaba (⭐ 4.1), Cooper's Fudge (⭐ 4.3), German Bakery Lonavala");
                    item.setAttractions("Khandala Ghat (45 mins), Karla Caves (1.5 hours), Tiger's Point (1 hour), Bhushi Dam (1.5 hours)");

                    String lonavalaTimeline = "[" +
                        "{\"time\": \"07:00 AM\", \"title\": \"Leave Mumbai\", \"details\": \"Start from Mumbai. " + (isBike ? "Bikes must take the Old NH4 highway. Ensure rain gear is ready." : "Climb the scenic Mumbai-Pune Expressway.") + "\"}," +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Sunny Da Dhaba\", \"details\": \"Stop at Sunny Da Dhaba for hot stuffed parathas and sweet lassi.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"Karla Caves Exploration\", \"details\": \"Hike up to the ancient 2nd century BC Buddhist rock-cut shrines, featuring grand pillars. Spend 1.5 hours.\"}," +
                        "{\"time\": \"12:00 PM\", \"title\": \"Tiger's Point Viewpoint\", \"details\": \"Head to Tiger's Point for a stunning view of steep valleys, waterfalls, and mist. Enjoy hot corn pakodas. Spend 1 hour.\"}," +
                        "{\"time\": \"01:30 PM\", \"title\": \"Lunch at Cooper's Fudge\", \"details\": \"Enjoy delicious lunch followed by purchase of their legendary chocolate walnut fudge. Spend 45 mins.\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Bhushi Dam\", \"details\": \"Splash around and relax on the steps of Bhushi Dam with cascading water streams. Spend 1.5 hours.\"}," +
                        "{\"time\": \"05:30 PM\", \"title\": \"Sunset at Lion's Point\", \"details\": \"Watch the sunset paint the Western Ghats orange from Lion's Point viewpoint. Spend 45 mins.\"}," +
                        "{\"time\": \"07:30 PM\", \"title\": \"Return Journey to Mumbai\", \"details\": \"Drive/ride back to Mumbai, arriving by 9:00 PM.\"}" +
                        "]";
                    item.setTimelineJson(lonavalaTimeline);
                } else {
                    item.setSuggestedTiming("09:00 AM - 05:00 PM");
                    item.setTitle("Day " + day + ": Lonavala Nature & Fort Sightseeing");
                    item.setDescription("Visit Lohagad Fort and Bhaja Caves for ancient architectural scenery.");
                    item.setActivities("Fort Trekking, Cave Photography, Lake Sightseeing");
                    item.setRestaurants("Rama Krishna Restaurant, Kinara Village Dhaba");
                    item.setAttractions("Lohagad Fort (2.5 hours), Bhaja Caves (1.5 hours), Pawna Lake (1.5 hours)");

                    String lonavalaDay2 = "[" +
                        "{\"time\": \"08:30 AM\", \"title\": \"Breakfast at Stay\", \"details\": \"Enjoy hot maharashtrian poha or misal pav.\"}," +
                        "{\"time\": \"09:30 AM\", \"title\": \"Lohagad Fort Trek\", \"details\": \"Trek up to Lohagad Fort, the iron fort of Shivaji. Enjoy stunning mountain trails. Spend 2.5 hours.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Lunch at Rama Krishna\", \"details\": \"Delicious Punjabi and South Indian food in Lonavala Town.\"}," +
                        "{\"time\": \"02:30 PM\", \"title\": \"Bhaja Caves visit\", \"details\": \"Explore Buddhist caves with beautiful stupas and carvings. Spend 1.5 hours.\"}," +
                        "{\"time\": \"04:30 PM\", \"title\": \"Pawna Lake Sunset\", \"details\": \"Sit by the peaceful shores of Pawna Lake for a beautiful sunset view. Spend 1.5 hours.\"}" +
                        "]";
                    item.setTimelineJson(lonavalaDay2);
                }
            } else {
                // Generic beautiful timeline
                item.setClimateInfo("Fair weather (22°C - 28°C). Pleasant breeze.");
                item.setSkipSuggestions("Rooftop decks during noon (too sunny, visit post-sunset instead)");
                if (isBike) {
                    item.setBikerWarnings("Ensure your bike is serviced for highway speeds, wear a full-face helmet, and check for local highway entry limits for two-wheelers.");
                }

                item.setSuggestedTiming("09:00 AM - 08:30 PM");
                if (day == 1) {
                    item.setTitle("Arrival & City Orientation of " + dest);
                    item.setDescription("Get familiar with " + dest + ", visit its central square, and experience a local sunset view.");
                    item.setActivities("Hotel Check-in, Neighborhood Walk, Sunset Viewpoint");
                    item.setRestaurants("Grand Landmark Bistro, Local Heritage Grill");
                    item.setAttractions("Historic Old Town (1.5 hours), Central Plaza (1 hour), Main Cathedral (45 mins)");

                    String timeline = "[" +
                        "{\"time\": \"09:00 AM\", \"title\": \"Arrival & Hotel Check-in\", \"details\": \"Settle in your hotel and refresh for the city exploration.\"}," +
                        "{\"time\": \"11:00 AM\", \"title\": \"Walk around Central Plaza\", \"details\": \"Explore the historic heart of the city. Spend 1 hour.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Welcome Lunch at Bistro\", \"details\": \"Taste authentic local dishes at highly rated Grand Landmark Bistro (⭐ 4.8 based on Google reviews).\"}," +
                        "{\"time\": \"03:00 PM\", \"title\": \"Historic Cathedral Tour\", \"details\": \"Visit the main iconic cathedral, admire the stained glass windows. Spend 45 mins.\"}," +
                        "{\"time\": \"06:00 PM\", \"title\": \"Sunset Viewpoint Climb\", \"details\": \"Walk up to the town's highest hill for a panoramic evening sunset vista. Spend 1 hour.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Traditional Welcome Dinner\", \"details\": \"Enjoy local cuisine accompanied by acoustic music at Local Heritage Grill.\"}" +
                        "]";
                    item.setTimelineJson(timeline);
                } else if (day == 2) {
                    item.setTitle("Cultural Immersive Day in " + dest);
                    item.setDescription("Explore museums, traditional arts, markets, and scenic neighborhood spots.");
                    item.setActivities("National Museum Visit, Local Food Tasting Tour, Park Walk");
                    item.setRestaurants("Heritage Dining Room, Street Food Haven");
                    item.setAttractions("Art Gallery (1.5 hours), Botanic Gardens (2 hours), Waterfront Promenade (1 hour)");

                    String timeline = "[" +
                        "{\"time\": \"09:00 AM\", \"title\": \"Morning Coffee & Pastry\", \"details\": \"Start your day at a cozy neighborhood cafe.\"}," +
                        "{\"time\": \"10:00 AM\", \"title\": \"National Museum Tour\", \"details\": \"Exquisite exhibition of history, artifacts, and art. Spend 2 hours.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Food Tasting Tour\", \"details\": \"Sample 5 different local street food items in the old market alleys. Spend 1.5 hours.\"}," +
                        "{\"time\": \"03:30 PM\", \"title\": \"Botanical Gardens Promenade\", \"details\": \"Tranquil lake walk, glass greenhouse visit, and swan spotting. Spend 2 hours.\"}," +
                        "{\"time\": \"06:30 PM\", \"title\": \"Waterfront Stroll\", \"details\": \"Catch the cool breeze along the main harbor promenade. Spend 1 hour.\"}," +
                        "{\"time\": \"08:00 PM\", \"title\": \"Seaside Seafood Dinner\", \"details\": \"Fresh catch of the day at Heritage Dining Room.\"}" +
                        "]";
                    item.setTimelineJson(timeline);
                } else {
                    item.setTitle("Hidden Gems & Adventure in " + dest);
                    item.setDescription("Discover off-the-beaten-path cafes, artisan shops, and scenic local activities.");
                    item.setActivities("Artisan Workshop, Boutique Shopping, Sunset Evening Cruise");
                    item.setRestaurants("Rooftop Skyline Bar, Sunset Lounge");
                    item.setAttractions("Hidden Garden (1 hour), Historic Library (45 mins), Harbor Wharf (1.5 hours)");

                    String timeline = "[" +
                        "{\"time\": \"09:30 AM\", \"title\": \"Artisan Pottery Workshop\", \"details\": \"Try your hands at traditional pottery making at a local artisan shop. Spend 1 hour.\"}," +
                        "{\"time\": \"11:30 AM\", \"title\": \"Boutique & Souvenir Shopping\", \"details\": \"Stroll around handcraft markets for unique authentic souvenirs. Spend 1.5 hours.\"}," +
                        "{\"time\": \"01:00 PM\", \"title\": \"Organic Garden Lunch\", \"details\": \"Farm-to-table lunch at a quiet greenhouse cafe.\"}," +
                        "{\"time\": \"03:00 PM\", \"title\": \"Historic Library Visit\", \"details\": \"Admire centuries-old books, architectural vaults, and quiet reading halls. Spend 45 mins.\"}," +
                        "{\"time\": \"05:30 PM\", \"title\": \"Sunset Cruise & Toast\", \"details\": \"Enjoy a relaxing boat cruise around the harbor with light music. Spend 1.5 hours.\"}," +
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
