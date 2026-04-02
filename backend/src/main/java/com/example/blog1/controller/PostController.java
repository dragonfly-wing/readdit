package com.example.blog1.controller;

import com.example.blog1.dto.Dto.*;
import com.example.blog1.model.Post;
import com.example.blog1.repository.UserRepository;
import com.example.blog1.security.JwtUtil;
import com.example.blog1.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired private PostService postService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;

    // ─── Feed ─────────────────────────────────────────────────────────────────

    @GetMapping
    public List<Post> getFeed(@RequestParam(required = false) String tag) {
        if (tag != null && !tag.isBlank()) {
            return postService.getPostsByTag(tag);
        }
        return postService.getPublishedPosts();
    }

    @GetMapping("/user/{authorId}")
    public List<Post> getPostsByUser(@PathVariable String authorId) {
        return postService.getPostsByUser(authorId);
    }

    // ─── Single post with comments ────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable String id,
                                     @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            String userId = extractUserIdFromHeader(authHeader);
            Map<String, Object> result = postService.getPostWithComments(id, userId);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest req,
                                        Authentication auth) {
        try {
            String userId = getUserId(auth);
            Post post = postService.createPost(req, userId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id,
                                        @RequestBody UpdatePostRequest req,
                                        Authentication auth) {
        try {
            String userId = getUserId(auth);
            String role = getRole(auth);
            Post post = postService.updatePost(id, req, userId, role);
            return ResponseEntity.ok(post);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(403).body(new MessageResponse(e.getMessage()));
        }
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id, Authentication auth) {
        try {
            String userId = getUserId(auth);
            String role = getRole(auth);
            postService.deletePost(id, userId, role);
            return ResponseEntity.ok(new MessageResponse("Post deleted"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(403).body(new MessageResponse(e.getMessage()));
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private String getUserId(Authentication auth) {
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow().getId();
    }

    private String getRole(Authentication auth) {
        return auth.getAuthorities().stream()
                .findFirst().map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
    }

    private String extractUserIdFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return jwtUtil.extractUserId(token);
            } catch (Exception ignored) {}
        }
        return null;
    }
}