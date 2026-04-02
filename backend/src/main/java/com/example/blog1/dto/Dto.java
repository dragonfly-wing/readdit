package com.example.blog1.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

public class Dto {

    @Data
    public static class RegisterRequest {
        @NotBlank
        @Size(min = 3, max = 30)
        private String username;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6)
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String userId;
        private String username;
        private String role;

        public AuthResponse(String token, String userId, String username, String role) {
            this.token = token;
            this.userId = userId;
            this.username = username;
            this.role = role;
        }
    }

    @Data
    public static class CreatePostRequest {
        @NotBlank private String title;
        private String content;
        private String status = "draft";
        private List<String> tags;
    }

    @Data
    public static class UpdatePostRequest {
        private String title;
        private String content;
        private String status;
        private List<String> tags;
    }

    @Data
    public static class CreateCommentRequest {
        @NotBlank private String content;
        private String parentCommentId;
    }

    @Data
    public static class UpdateCommentRequest {
        @NotBlank private String content;
    }

    @Data
    public static class FollowStatusResponse {
        private boolean following;
        private long followerCount;
        private long followingCount;

        public FollowStatusResponse(boolean following, long followerCount, long followingCount) {
            this.following = following;
            this.followerCount = followerCount;
            this.followingCount = followingCount;
        }
    }

    @Data
    public static class CreateReportRequest {
        @NotBlank private String type;
        @NotBlank private String targetId;
        @NotBlank private String reason;
        private String description;
    }

    @Data
    public static class ResolveReportRequest {
        @NotBlank private String action;
    }

    @Data
    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
    }

    @Data
    public static class LikeStatusResponse {
        private boolean liked;
        private int likeCount;

        public LikeStatusResponse(boolean liked, int likeCount) {
            this.liked = liked;
            this.likeCount = likeCount;
        }
    }

    @Data
    public static class UserProfileResponse {
        private String id;
        private String username;
        private String email;
        private String role;
        private LocalDateTime createdAt;
        private long followerCount;
        private long followingCount;
        private boolean isFollowing;
    }
}