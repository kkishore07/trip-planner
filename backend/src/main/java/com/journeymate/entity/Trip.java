package com.journeymate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String destination;

    private String fromPlace;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer travelersCount;

    private String travelMode; // e.g. Flight, Train, Car

    private String travelPreferences; // e.g. Adventure, Luxury, Budget, Cultural

    private BigDecimal budget;

    @Column(precision = 5, scale = 2)
    private BigDecimal fuelMileage;

    @Column(precision = 6, scale = 2)
    private BigDecimal fuelPrice;

    @Column(precision = 8, scale = 2)
    private BigDecimal estimatedDistance;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalExpense;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItineraryItem> itineraries = new ArrayList<>();

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Expense> expenses = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (totalExpense == null) {
            totalExpense = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
