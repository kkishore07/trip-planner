package com.journeymate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDTOs {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Username or email is required")
        private String usernameOrEmail;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50)
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 100)
        private String password;

        private String fullName;
        private String adminCode; // Optional secret code to register as admin
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private String avatarUrl;

        public AuthResponse(String token, Long id, String username, String email, String fullName, String role, String avatarUrl) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.avatarUrl = avatarUrl;
        }
    }

    @Data
    public static class UserProfile {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String avatarUrl;
        private String role;
    }

    @Data
    public static class ProfileUpdateRequest {
        private String fullName;
        private String avatarUrl;
        private String password;
    }
}
