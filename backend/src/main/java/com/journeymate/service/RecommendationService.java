package com.journeymate.service;

import com.journeymate.dto.RecommendationDTOs;
import java.util.List;

public interface RecommendationService {
    List<RecommendationDTOs.RecommendationResponse> getRecommendations(String destination, String category);
}
