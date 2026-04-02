package com.example.blog1.service;

import com.example.blog1.dto.Dto.*;
import com.example.blog1.model.User;
import com.example.blog1.repository.FollowRepository;
import com.example.blog1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private FollowRepository followRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(String userId, String currentUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        UserProfileResponse resp = new UserProfileResponse();
        resp.setId(user.getId());
        resp.setUsername(user.getUsername());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole());
        resp.setCreatedAt(user.getCreatedAt());
        resp.setFollowerCount(followRepository.countByFollowingId(userId));
        resp.setFollowingCount(followRepository.countByFollowerId(userId));

        if (currentUserId != null && !currentUserId.equals(userId)) {
            resp.setFollowing(followRepository.existsByFollowerIdAndFollowingId(currentUserId, userId));
        }

        return resp;
    }

    public User updateProfile(String userId, String requestingUserId, String role,
                              String newUsername, String newEmail, String newPassword) {
        if (!userId.equals(requestingUserId) && !"MODERATOR".equals(role)) {
            throw new AccessDeniedException("You can only update your own profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (newUsername != null && !newUsername.equals(user.getUsername())) {
            if (userRepository.existsByUsername(newUsername)) {
                throw new IllegalArgumentException("Username already taken");
            }
            user.setUsername(newUsername);
        }
        if (newEmail != null && !newEmail.equals(user.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email already registered");
            }
            user.setEmail(newEmail);
        }
        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(user);
    }

    public User promoteToModerator(String userId, String requestingRole) {
        if (!"MODERATOR".equals(requestingRole)) {
            throw new AccessDeniedException("Only moderators can promote users");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        user.setRole("MODERATOR");
        return userRepository.save(user);
    }
}