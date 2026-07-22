package com.journeymate.service.impl;

import com.journeymate.dto.ExpenseDTOs;
import com.journeymate.dto.TripDTOs;
import com.journeymate.entity.Expense;
import com.journeymate.entity.ItineraryItem;
import com.journeymate.entity.Trip;
import com.journeymate.entity.User;
import com.journeymate.exception.ResourceNotFoundException;
import com.journeymate.repository.TripRepository;
import com.journeymate.repository.UserRepository;
import com.journeymate.service.AiItineraryService;
import com.journeymate.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final AiItineraryService aiItineraryService;

    @Override
    @Transactional
    public TripDTOs.TripResponse createTrip(String username, TripDTOs.CreateTripRequest request) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Trip trip = Trip.builder()
                .user(user)
                .destination(request.getDestination())
                .fromPlace(request.getFromPlace())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelersCount(request.getTravelersCount())
                .travelMode(request.getTravelMode())
                .travelPreferences(request.getTravelPreferences())
                .budget(request.getBudget() != null ? request.getBudget() : BigDecimal.ZERO)
                .fuelMileage(request.getFuelMileage() != null ? request.getFuelMileage() : (request.getTravelMode() != null && request.getTravelMode().equalsIgnoreCase("Bike") ? new BigDecimal("40.00") : new BigDecimal("15.00")))
                .fuelPrice(request.getFuelPrice() != null ? request.getFuelPrice() : new BigDecimal("103.00"))
                .estimatedDistance(request.getEstimatedDistance() != null ? request.getEstimatedDistance() : new BigDecimal("300.00"))
                .totalExpense(BigDecimal.ZERO)
                .build();

        Trip savedTrip = tripRepository.save(trip);
        return mapToTripResponse(savedTrip);
    }

    @Override
    public TripDTOs.TripResponse getTripById(String username, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with ID: " + tripId));
        return mapToTripResponse(trip);
    }

    @Override
    public List<TripDTOs.TripResponse> getUserTrips(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        List<Trip> trips = tripRepository.findByUserOrderByCreatedAtDesc(user);
        return trips.stream().map(this::mapToTripResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TripDTOs.TripResponse updateTrip(String username, Long tripId, TripDTOs.CreateTripRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with ID: " + tripId));

        trip.setDestination(request.getDestination());
        trip.setFromPlace(request.getFromPlace());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setTravelersCount(request.getTravelersCount());
        trip.setTravelMode(request.getTravelMode());
        trip.setTravelPreferences(request.getTravelPreferences());
        if (request.getBudget() != null) {
            trip.setBudget(request.getBudget());
        }
        if (request.getFuelMileage() != null) {
            trip.setFuelMileage(request.getFuelMileage());
        }
        if (request.getFuelPrice() != null) {
            trip.setFuelPrice(request.getFuelPrice());
        }
        if (request.getEstimatedDistance() != null) {
            trip.setEstimatedDistance(request.getEstimatedDistance());
        }

        if (request.getItineraries() != null) {
            for (TripDTOs.ItineraryResponse itReq : request.getItineraries()) {
                if (itReq.getId() != null) {
                    trip.getItineraries().stream()
                        .filter(item -> item.getId().equals(itReq.getId()))
                        .findFirst()
                        .ifPresent(item -> {
                            item.setTitle(itReq.getTitle());
                            item.setDescription(itReq.getDescription());
                            item.setActivities(itReq.getActivities());
                            item.setRestaurants(itReq.getRestaurants());
                            item.setAttractions(itReq.getAttractions());
                            item.setSuggestedTiming(itReq.getSuggestedTiming());
                            item.setEstimatedCost(itReq.getEstimatedCost());
                            if (itReq.getClimateInfo() != null) item.setClimateInfo(itReq.getClimateInfo());
                            if (itReq.getSkipSuggestions() != null) item.setSkipSuggestions(itReq.getSkipSuggestions());
                            if (itReq.getBikerWarnings() != null) item.setBikerWarnings(itReq.getBikerWarnings());
                            if (itReq.getTimelineJson() != null) item.setTimelineJson(itReq.getTimelineJson());
                        });
                }
            }
        }

        Trip updated = tripRepository.save(trip);
        return mapToTripResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTrip(String username, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with ID: " + tripId));
        tripRepository.delete(trip);
    }

    @Override
    @Transactional
    public TripDTOs.TripResponse generateAiTrip(String username, TripDTOs.GenerateItineraryRequest request) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        int duration = request.getDurationDays() != null ? request.getDurationDays() : 3;
        BigDecimal distance = calculateDistance(request.getDestination(), request.getFromPlace(), duration);

        Trip trip = Trip.builder()
                .user(user)
                .destination(request.getDestination())
                .fromPlace(request.getFromPlace())
                .startDate(java.time.LocalDate.now())
                .endDate(java.time.LocalDate.now().plusDays(duration))
                .travelersCount(request.getTravelersCount())
                .travelMode(request.getTravelMode() != null ? request.getTravelMode() : "Flight")
                .travelPreferences(request.getPreferences())
                .budget(request.getBudget() != null ? request.getBudget() : new BigDecimal("1000.00"))
                .fuelMileage(request.getTravelMode() != null && request.getTravelMode().equalsIgnoreCase("Bike") ? new BigDecimal("40.00") : new BigDecimal("15.00"))
                .fuelPrice(new BigDecimal("103.00"))
                .estimatedDistance(distance)
                .totalExpense(BigDecimal.ZERO)
                .build();

        List<ItineraryItem> itineraries = aiItineraryService.generateItineraryForTrip(trip, request);
        trip.setItineraries(itineraries);

        Trip savedTrip = tripRepository.save(trip);
        return mapToTripResponse(savedTrip);
    }

    private BigDecimal calculateDistance(String destination, String fromPlace, int duration) {
        String destLower = destination != null ? destination.toLowerCase() : "";
        String fromLower = fromPlace != null ? fromPlace.toLowerCase() : "";
        
        if (destLower.contains("munnar")) {
            return BigDecimal.valueOf(155 * 2 + (duration > 1 ? (duration - 1) * 60 : 0));
        } else if (destLower.contains("valparai")) {
            return BigDecimal.valueOf(100 * 2 + (duration > 1 ? (duration - 1) * 50 : 0));
        } else if (destLower.contains("ooty")) {
            return BigDecimal.valueOf(270 * 2 + (duration > 1 ? (duration - 1) * 60 : 0));
        } else if (destLower.contains("jaipur")) {
            return BigDecimal.valueOf(270 * 2 + (duration > 1 ? (duration - 1) * 45 : 0));
        } else if (destLower.contains("lonavala")) {
            return BigDecimal.valueOf(85 * 2 + (duration > 1 ? (duration - 1) * 40 : 0));
        }
        
        return BigDecimal.valueOf(300.00);
    }

    private TripDTOs.TripResponse mapToTripResponse(Trip trip) {
        TripDTOs.TripResponse response = new TripDTOs.TripResponse();
        response.setId(trip.getId());
        response.setDestination(trip.getDestination());
        response.setFromPlace(trip.getFromPlace());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setTravelersCount(trip.getTravelersCount());
        response.setTravelMode(trip.getTravelMode());
        response.setTravelPreferences(trip.getTravelPreferences());
        response.setBudget(trip.getBudget());
        response.setFuelMileage(trip.getFuelMileage());
        response.setFuelPrice(trip.getFuelPrice());
        response.setEstimatedDistance(trip.getEstimatedDistance());
        response.setTotalExpense(trip.getTotalExpense());

        BigDecimal remaining = (trip.getBudget() != null ? trip.getBudget() : BigDecimal.ZERO)
                .subtract(trip.getTotalExpense() != null ? trip.getTotalExpense() : BigDecimal.ZERO);
        response.setRemainingBudget(remaining);

        if (trip.getItineraries() != null) {
            response.setItineraries(trip.getItineraries().stream().map(it -> {
                TripDTOs.ItineraryResponse itemRes = new TripDTOs.ItineraryResponse();
                itemRes.setId(it.getId());
                itemRes.setDayNumber(it.getDayNumber());
                itemRes.setTitle(it.getTitle());
                itemRes.setDescription(it.getDescription());
                itemRes.setActivities(it.getActivities());
                itemRes.setRestaurants(it.getRestaurants());
                itemRes.setAttractions(it.getAttractions());
                itemRes.setSuggestedTiming(it.getSuggestedTiming());
                itemRes.setEstimatedCost(it.getEstimatedCost());
                itemRes.setClimateInfo(it.getClimateInfo());
                itemRes.setSkipSuggestions(it.getSkipSuggestions());
                itemRes.setBikerWarnings(it.getBikerWarnings());
                itemRes.setTimelineJson(it.getTimelineJson());
                return itemRes;
            }).collect(Collectors.toList()));
        }

        if (trip.getExpenses() != null) {
            response.setExpenses(trip.getExpenses().stream().map(ex -> {
                ExpenseDTOs.ExpenseResponse expRes = new ExpenseDTOs.ExpenseResponse();
                expRes.setId(ex.getId());
                expRes.setTripId(trip.getId());
                expRes.setCategory(ex.getCategory());
                expRes.setAmount(ex.getAmount());
                expRes.setCurrency(ex.getCurrency());
                expRes.setDescription(ex.getDescription());
                expRes.setExpenseDate(ex.getExpenseDate());
                return expRes;
            }).collect(Collectors.toList()));
        }

        return response;
    }
}
