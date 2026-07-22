package com.journeymate.controller;

import com.journeymate.dto.AuthDTOs;
import com.journeymate.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping
    public ResponseEntity<AuthDTOs.UserProfile> getProfile(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUserProfile(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<AuthDTOs.UserProfile> updateProfile(
            Authentication authentication,
            @RequestBody AuthDTOs.ProfileUpdateRequest request) {
        return ResponseEntity.ok(authService.updateProfile(authentication.getName(), request));
    }
}
