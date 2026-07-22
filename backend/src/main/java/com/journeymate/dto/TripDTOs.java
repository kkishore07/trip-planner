package com.journeymate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TripDTOs {

    @Data
    public static class CreateTripRequest {
        @NotBlank(message = "Destination is required")
        private String destination;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        @NotNull(message = "End date is required")
        private LocalDate endDate;

        private Integer travelersCount = 1;
        private String travelMode = "Flight";
        private String travelPreferences = "Balanced";
        private BigDecimal budget = BigDecimal.ZERO;
    }

    @Data
    public static class TripResponse {
        private Long id;
        private String destination;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer travelersCount;
        private String travelMode;
        private String travelPreferences;
        private BigDecimal budget;
        private BigDecimal totalExpense;
        private BigDecimal remainingBudget;
        private List<ItineraryResponse> itineraries;
        private List<ExpenseDTOs.ExpenseResponse> expenses;
    }

    @Data
    public static class ItineraryResponse {
        private Long id;
        private Integer dayNumber;
        private String title;
        private String description;
        private String activities;
        private String restaurants;
        private String attractions;
        private String suggestedTiming;
        private BigDecimal estimatedCost;
        private String timelineJson;
    }

    @Data
    public static class GenerateItineraryRequest {
        @NotBlank(message = "Destination is required")
        private String destination;
        private Integer durationDays = 3;
        private Integer travelersCount = 1;
        private String preferences = "Adventure & Food";
        private BigDecimal budget = new BigDecimal("1000.00");
    }
}
