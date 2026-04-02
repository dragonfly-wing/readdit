package com.example.blog1.controller;

import com.example.blog1.dto.Dto.*;
import com.example.blog1.model.Comment;
import com.example.blog1.repository.UserRepository;
import com.example.blog1.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired private CommentService commentService;
    @Autowired private UserRepository userRepository;

    @GetMapping("/post/{postId}")
    public List<Comment> getComments(@PathVariable String postId) {
        return commentService.getCommentsForPost(postId);
    }

    @GetMapping("/replies/{parentId}")
    public List<Comment> getReplies(@PathVariable String parentId) {
        return commentService.getReplies(parentId);
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<?> addComment(@PathVariable String postId,
                                        @Valid @RequestBody CreateCommentRequest req,
                                        Authentication auth) {
        try {
            String userId = getUserId(auth);
            Comment comment = commentService.addComment(postId, req, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String commentId,
                                           @Valid @RequestBody UpdateCommentRequest req,
                                           Authentication auth) {
        try {
            String userId = getUserId(auth);
            String role = getRole(auth);
            Comment comment = commentService.updateComment(commentId, req, userId, role);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId, Authentication auth) {
        try {
            String userId = getUserId(auth);
            String role = getRole(auth);
            commentService.deleteComment(commentId, userId, role);
            return ResponseEntity.ok(new MessageResponse("Comment deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(new MessageResponse(e.getMessage()));
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