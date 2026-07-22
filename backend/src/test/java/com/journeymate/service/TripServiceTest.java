package com.journeymate.service;

import com.journeymate.dto.TripDTOs;
import com.journeymate.entity.Role;
import com.journeymate.entity.Trip;
import com.journeymate.entity.User;
import com.journeymate.repository.TripRepository;
import com.journeymate.repository.UserRepository;
import com.journeymate.service.impl.TripServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AiItineraryService aiItineraryService;

    @InjectMocks
    private TripServiceImpl tripService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .username("traveler")
                .email("traveler@example.com")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    void testCreateTrip_Success() {
        TripDTOs.CreateTripRequest request = new TripDTOs.CreateTripRequest();
        request.setDestination("Tokyo");
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().plusDays(5));
        request.setTravelersCount(2);
        request.setBudget(new BigDecimal("2500.00"));

        Trip savedTrip = Trip.builder()
                .id(10L)
                .user(sampleUser)
                .destination("Tokyo")
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .travelersCount(2)
                .budget(new BigDecimal("2500.00"))
                .totalExpense(BigDecimal.ZERO)
                .build();

        when(userRepository.findByUsernameOrEmail("traveler", "traveler")).thenReturn(Optional.of(sampleUser));
        when(tripRepository.save(any(Trip.class))).thenReturn(savedTrip);

        TripDTOs.TripResponse response = tripService.createTrip("traveler", request);

        assertNotNull(response);
        assertEquals("Tokyo", response.getDestination());
        assertEquals(new BigDecimal("2500.00"), response.getBudget());
        verify(tripRepository, times(1)).save(any(Trip.class));
    }
}
