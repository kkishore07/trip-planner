package com.journeymate.service.impl;

import com.journeymate.dto.AdminDTOs;
import com.journeymate.dto.AuthDTOs;
import com.journeymate.entity.User;
import com.journeymate.exception.ResourceNotFoundException;
import com.journeymate.repository.ItineraryRepository;
import com.journeymate.repository.TripRepository;
import com.journeymate.repository.UserRepository;
import com.journeymate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;

    @Override
    public AdminDTOs.AdminDashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalTrips = tripRepository.count();
        long totalItineraries = itineraryRepository.count();
        Double totalBudget = tripRepository.sumAllBudgets();
        if (totalBudget == null) totalBudget = 0.0;

        List<AuthDTOs.UserProfile> recentUsers = userRepository.findAll().stream()
                .limit(5)
                .map(this::mapUserToProfile)
                .collect(Collectors.toList());

        return AdminDTOs.AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .totalTrips(totalTrips)
                .totalItineraries(totalItineraries)
                .totalPlatformBudget(totalBudget)
                .recentUsers(recentUsers)
                .build();
    }

    @Override
    public List<AuthDTOs.UserProfile> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToProfile)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        userRepository.delete(user);
    }

    private AuthDTOs.UserProfile mapUserToProfile(User user) {
        AuthDTOs.UserProfile p = new AuthDTOs.UserProfile();
        p.setId(user.getId());
        p.setUsername(user.getUsername());
        p.setEmail(user.getEmail());
        p.setFullName(user.getFullName());
        p.setAvatarUrl(user.getAvatarUrl());
        p.setRole(user.getRole().name());
        return p;
    }
}
