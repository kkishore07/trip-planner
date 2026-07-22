package com.journeymate.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

public class AdminDTOs {

    @Data
    @Builder
    public static class AdminDashboardStats {
        private Long totalUsers;
        private Long totalTrips;
        private Long totalItineraries;
        private Double totalPlatformBudget;
        private List<AuthDTOs.UserProfile> recentUsers;
        private List<TripDTOs.TripResponse> recentTrips;
    }
}
