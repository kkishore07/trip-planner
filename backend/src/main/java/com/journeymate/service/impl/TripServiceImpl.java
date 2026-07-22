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
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelersCount(request.getTravelersCount())
                .travelMode(request.getTravelMode())
                .travelPreferences(request.getTravelPreferences())
                .budget(request.getBudget() != null ? request.getBudget() : BigDecimal.ZERO)
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
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setTravelersCount(request.getTravelersCount());
        trip.setTravelMode(request.getTravelMode());
        trip.setTravelPreferences(request.getTravelPreferences());
        if (request.getBudget() != null) {
            trip.setBudget(request.getBudget());
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

        Trip trip = Trip.builder()
                .user(user)
                .destination(request.getDestination())
                .startDate(java.time.LocalDate.now())
                .endDate(java.time.LocalDate.now().plusDays(duration))
                .travelersCount(request.getTravelersCount())
                .travelMode("Flight")
                .travelPreferences(request.getPreferences())
                .budget(request.getBudget() != null ? request.getBudget() : new BigDecimal("1000.00"))
                .totalExpense(BigDecimal.ZERO)
                .build();

        List<ItineraryItem> itineraries = aiItineraryService.generateItineraryForTrip(trip, request);
        trip.setItineraries(itineraries);

        Trip savedTrip = tripRepository.save(trip);
        return mapToTripResponse(savedTrip);
    }

    private TripDTOs.TripResponse mapToTripResponse(Trip trip) {
        TripDTOs.TripResponse response = new TripDTOs.TripResponse();
        response.setId(trip.getId());
        response.setDestination(trip.getDestination());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setTravelersCount(trip.getTravelersCount());
        response.setTravelMode(trip.getTravelMode());
        response.setTravelPreferences(trip.getTravelPreferences());
        response.setBudget(trip.getBudget());
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
