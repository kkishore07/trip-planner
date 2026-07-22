package com.journeymate.repository;

import com.journeymate.entity.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryRepository extends JpaRepository<ItineraryItem, Long> {
    List<ItineraryItem> findByTripIdOrderByDayNumberAsc(Long tripId);
    void deleteByTripId(Long tripId);
}
