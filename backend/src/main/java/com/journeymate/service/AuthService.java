package com.journeymate.service;

import com.journeymate.dto.AuthDTOs;

public interface AuthService {
    AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request);
    AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request);
    AuthDTOs.UserProfile getCurrentUserProfile(String username);
    AuthDTOs.UserProfile updateProfile(String username, AuthDTOs.ProfileUpdateRequest request);
}
