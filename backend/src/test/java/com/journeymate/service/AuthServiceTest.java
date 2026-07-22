package com.journeymate.service;

import com.journeymate.dto.AuthDTOs;
import com.journeymate.entity.Role;
import com.journeymate.entity.User;
import com.journeymate.repository.UserRepository;
import com.journeymate.security.JwtUtils;
import com.journeymate.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .username("john_doe")
                .email("john@example.com")
                .password("encoded_pass")
                .fullName("John Doe")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    void testGetCurrentUserProfile_Success() {
        when(userRepository.findByUsernameOrEmail("john_doe", "john_doe")).thenReturn(Optional.of(sampleUser));

        AuthDTOs.UserProfile profile = authService.getCurrentUserProfile("john_doe");

        assertNotNull(profile);
        assertEquals("john_doe", profile.getUsername());
        assertEquals("john@example.com", profile.getEmail());
    }

    @Test
    void testRegister_Success() {
        AuthDTOs.RegisterRequest registerReq = new AuthDTOs.RegisterRequest();
        registerReq.setUsername("newuser");
        registerReq.setEmail("newuser@example.com");
        registerReq.setPassword("password123");
        registerReq.setFullName("New User");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        // Expect login attempt upon successful registration
        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException("Authentication mock reached"));

        assertThrows(RuntimeException.class, () -> authService.register(registerReq));
        verify(userRepository, times(1)).save(any(User.class));
    }
}
