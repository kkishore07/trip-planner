package com.journeymate.repository;

import com.journeymate.entity.Trip;
import com.journeymate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserOrderByCreatedAtDesc(User user);
    List<Trip> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT SUM(t.budget) FROM Trip t")
    Double sumAllBudgets();
}
