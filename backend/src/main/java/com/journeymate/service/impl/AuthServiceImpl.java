package com.journeymate.service.impl;

import com.journeymate.dto.AuthDTOs;
import com.journeymate.entity.Role;
import com.journeymate.entity.User;
import com.journeymate.exception.BadRequestException;
import com.journeymate.exception.ResourceNotFoundException;
import com.journeymate.repository.UserRepository;
import com.journeymate.security.JwtUtils;
import com.journeymate.security.UserPrincipal;
import com.journeymate.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthDTOs.AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getAvatarUrl()
        );
    }

    @Override
    public AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        Role userRole = Role.ROLE_USER;
        if ("ADMIN123".equals(request.getAdminCode())) {
            userRole = Role.ROLE_ADMIN;
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName() != null ? request.getFullName() : request.getUsername())
                .role(userRole)
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getUsername())
                .build();

        userRepository.save(user);

        // Auto login after registration
        return login(new AuthDTOs.LoginRequest() {{
            setUsernameOrEmail(request.getUsername());
            setPassword(request.getPassword());
        }});
    }

    @Override
    public AuthDTOs.UserProfile getCurrentUserProfile(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        AuthDTOs.UserProfile profile = new AuthDTOs.UserProfile();
        profile.setId(user.getId());
        profile.setUsername(user.getUsername());
        profile.setEmail(user.getEmail());
        profile.setFullName(user.getFullName());
        profile.setAvatarUrl(user.getAvatarUrl());
        profile.setRole(user.getRole().name());
        return profile;
    }

    @Override
    public AuthDTOs.UserProfile updateProfile(String username, AuthDTOs.ProfileUpdateRequest request) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
        return getCurrentUserProfile(username);
    }
}
