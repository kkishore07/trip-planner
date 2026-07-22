package com.journeymate.controller;

import com.journeymate.dto.RecommendationDTOs;
import com.journeymate.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<RecommendationDTOs.RecommendationResponse>> getRecommendations(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(recommendationService.getRecommendations(destination, category));
    }
}
