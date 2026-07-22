package com.journeymate.service;

import com.journeymate.dto.AdminDTOs;
import com.journeymate.dto.AuthDTOs;
import java.util.List;

public interface AdminService {
    AdminDTOs.AdminDashboardStats getDashboardStats();
    List<AuthDTOs.UserProfile> getAllUsers();
    void deleteUser(Long userId);
}
