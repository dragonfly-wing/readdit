package com.example.blog1.controller;

import com.example.blog1.dto.Dto.*;
import com.example.blog1.model.User;
import com.example.blog1.repository.UserRepository;
import com.example.blog1.service.FollowService;
import com.example.blog1.service.LikeService;
import com.example.blog1.service.ReportService;
import com.example.blog1.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ─── Likes ────────────────────────────────────────────────────────────────────

@RestController
@RequestMapping("/api/likes")
class LikeController {

    @Autowired private LikeService likeService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/{postId}/toggle")
    public ResponseEntity<?> toggle(@PathVariable String postId, Authentication auth) {
        try {
            String userId = getUserId(auth);
            return ResponseEntity.ok(likeService.toggleLike(postId, userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{postId}/status")
    public ResponseEntity<?> status(@PathVariable String postId,
                                    @RequestHeader(value = "Authorization", required = false) String header) {
        String userId = null;
        if (header != null && header.startsWith("Bearer ")) {
            // We'll return non-liked for unauthenticated — service handles null userId
        }
        return ResponseEntity.ok(likeService.getStatus(postId, userId));
    }

    private String getUserId(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow().getId();
    }
}

// ─── Follow ───────────────────────────────────────────────────────────────────

@RestController
@RequestMapping("/api/follow")
class FollowController {

    @Autowired private FollowService followService;
    @Autowired private UserRepository userRepository;

    @PostMapping("/{targetUserId}/toggle")
    public ResponseEntity<?> toggle(@PathVariable String targetUserId, Authentication auth) {
        try {
            String userId = getUserId(auth);
            return ResponseEntity.ok(followService.toggleFollow(targetUserId, userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{targetUserId}/status")
    public ResponseEntity<?> status(@PathVariable String targetUserId, Authentication auth) {
        String currentUserId = auth != null ? getUserId(auth) : null;
        return ResponseEntity.ok(followService.getStatus(targetUserId, currentUserId));
    }

    @GetMapping("/{userId}/followers")
    public List<User> getFollowers(@PathVariable String userId) {
        return followService.getFollowers(userId);
    }

    @GetMapping("/{userId}/following")
    public List<User> getFollowing(@PathVariable String userId) {
        return followService.getFollowing(userId);
    }

    private String getUserId(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow().getId();
    }
}

// ─── Users ────────────────────────────────────────────────────────────────────

@RestController
@RequestMapping("/api/users")
class UserController {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable String userId,
                                        @RequestHeader(value = "Authorization", required = false) String header) {
        try {
            String currentUserId = null;
            // currentUserId resolution is done in PostController pattern — keep simple here
            UserProfileResponse profile = userService.getProfile(userId, currentUserId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable String userId,
                                           @RequestBody Map<String, String> body,
                                           Authentication auth) {
        try {
            String requestingUserId = getUserId(auth);
            String role = getRole(auth);
            User updated = userService.updateProfile(userId, requestingUserId, role,
                    body.get("username"), body.get("email"), body.get("password"));
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{userId}/promote")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> promote(@PathVariable String userId, Authentication auth) {
        try {
            String role = getRole(auth);
            User promoted = userService.promoteToModerator(userId, role);
            return ResponseEntity.ok(promoted);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    private String getUserId(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow().getId();
    }

    private String getRole(Authentication auth) {
        return auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")).orElse("USER");
    }
}

// ─── Reports ─────────────────────────────────────────────────────────────────

@RestController
@RequestMapping("/api/reports")
class ReportController {

    @Autowired private ReportService reportService;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createReport(@Valid @RequestBody CreateReportRequest req,
                                          Authentication auth) {
        try {
            String userId = getUserId(auth);
            return ResponseEntity.ok(reportService.createReport(req, userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> getReports(@RequestParam(required = false) String status) {
        if ("pending".equals(status)) {
            return ResponseEntity.ok(reportService.getPendingReports());
        }
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PatchMapping("/{reportId}/resolve")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> resolveReport(@PathVariable String reportId,
                                           @RequestBody ResolveReportRequest req,
                                           Authentication auth) {
        try {
            String userId = getUserId(auth);
            return ResponseEntity.ok(reportService.resolveReport(reportId, req, userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    private String getUserId(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow().getId();
    }
}