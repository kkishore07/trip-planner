package com.journeymate.service;

import com.journeymate.dto.TripDTOs;
import java.util.List;

public interface TripService {
    TripDTOs.TripResponse createTrip(String username, TripDTOs.CreateTripRequest request);
    TripDTOs.TripResponse getTripById(String username, Long tripId);
    List<TripDTOs.TripResponse> getUserTrips(String username);
    TripDTOs.TripResponse updateTrip(String username, Long tripId, TripDTOs.CreateTripRequest request);
    void deleteTrip(String username, Long tripId);
    TripDTOs.TripResponse generateAiTrip(String username, TripDTOs.GenerateItineraryRequest request);
}
