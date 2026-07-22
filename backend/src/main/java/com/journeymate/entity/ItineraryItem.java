package com.journeymate.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "itineraries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    private Trip trip;

    private Integer dayNumber;

    private String title;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String activities; // JSON or comma-separated list

    @Column(length = 1000)
    private String restaurants; // JSON or comma-separated list

    @Column(length = 1000)
    private String attractions; // JSON or comma-separated list

    private String suggestedTiming;

    private BigDecimal estimatedCost;

    private String climateInfo;

    private String skipSuggestions;

    private String bikerWarnings;

    @Column(length = 4000)
    private String timelineJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
