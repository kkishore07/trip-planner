package com.journeymate.service;

import com.journeymate.dto.TripDTOs;
import com.journeymate.entity.ItineraryItem;
import com.journeymate.entity.Trip;

import java.util.List;

public interface AiItineraryService {
    List<ItineraryItem> generateItineraryForTrip(Trip trip, TripDTOs.GenerateItineraryRequest request);
    String generateChatReply(String userMessage, String destinationContext);
}
