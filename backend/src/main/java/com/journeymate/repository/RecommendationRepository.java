package com.journeymate.repository;

import com.journeymate.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByDestinationNameIgnoreCase(String destinationName);
    List<Recommendation> findByCategoryIgnoreCase(String category);
}
