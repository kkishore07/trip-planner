package com.journeymate.dto;

import lombok.Builder;
import lombok.Data;

public class RecommendationDTOs {

    @Data
    @Builder
    public static class RecommendationResponse {
        private Long id;
        private String destinationName;
        private String category;
        private String title;
        private String description;
        private Double rating;
        private String address;
        private String imageUrl;
        private Integer reviewCount;
        private String reviewSnippet;
    }
}
