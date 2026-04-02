package com.example.blog1.service;

import com.example.blog1.dto.Dto.FollowStatusResponse;
import com.example.blog1.model.Follow;
import com.example.blog1.model.User;
import com.example.blog1.repository.FollowRepository;
import com.example.blog1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class FollowService {

    @Autowired private FollowRepository followRepository;
    @Autowired private UserRepository userRepository;

    public FollowStatusResponse toggleFollow(String targetUserId, String currentUserId) {
        if (targetUserId.equals(currentUserId)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        userRepository.findById(targetUserId)
                .orElseThrow(() -> new NoSuchElementException("Target user not found"));

        boolean nowFollowing;
        if (followRepository.existsByFollowerIdAndFollowingId(currentUserId, targetUserId)) {
            followRepository.deleteByFollowerIdAndFollowingId(currentUserId, targetUserId);
            nowFollowing = false;
        } else {
            followRepository.save(Follow.builder()
                    .followerId(currentUserId)
                    .followingId(targetUserId)
                    .build());
            nowFollowing = true;
        }

        return new FollowStatusResponse(
                nowFollowing,
                followRepository.countByFollowingId(targetUserId),
                followRepository.countByFollowerId(targetUserId)
        );
    }

    public FollowStatusResponse getStatus(String targetUserId, String currentUserId) {
        boolean following = currentUserId != null &&
                followRepository.existsByFollowerIdAndFollowingId(currentUserId, targetUserId);
        return new FollowStatusResponse(
                following,
                followRepository.countByFollowingId(targetUserId),
                followRepository.countByFollowerId(targetUserId)
        );
    }

    public List<User> getFollowers(String userId) {
        return followRepository.findByFollowingId(userId).stream()
                .map(f -> userRepository.findById(f.getFollowerId()).orElse(null))
                .filter(u -> u != null)
                .toList();
    }

    public List<User> getFollowing(String userId) {
        return followRepository.findByFollowerId(userId).stream()
                .map(f -> userRepository.findById(f.getFollowingId()).orElse(null))
                .filter(u -> u != null)
                .toList();
    }
}