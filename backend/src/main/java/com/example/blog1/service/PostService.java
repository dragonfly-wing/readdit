package com.example.blog1.service;

import com.example.blog1.dto.Dto.*;
import com.example.blog1.model.Comment;
import com.example.blog1.model.Post;
import com.example.blog1.model.User;
import com.example.blog1.repository.CommentRepository;
import com.example.blog1.repository.LikeRepository;
import com.example.blog1.repository.PostRepository;
import com.example.blog1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PostService {

    @Autowired private PostRepository postRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private LikeRepository likeRepository;
    @Autowired private UserRepository userRepository;

    // ─── Feed ─────────────────────────────────────────────────────────────────

    public List<Post> getPublishedPosts() {
        return postRepository.findByStatusOrderByCreatedAtDesc("published");
    }

    public List<Post> getPostsByTag(String tag) {
        return postRepository.findByTagsContainingAndStatus(tag, "published");
    }

    public List<Post> getPostsByUser(String authorId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    // ─── Single post with comments ────────────────────────────────────────────

    public Map<String, Object> getPostWithComments(String postId, String currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        List<Comment> topComments = commentRepository
                .findByPostIdAndParentCommentIdIsNullOrderByCreatedAtAsc(postId);

        List<Map<String, Object>> commentTree = new ArrayList<>();
        for (Comment c : topComments) {
            Map<String, Object> node = new HashMap<>();
            node.put("comment", c);
            node.put("replies", commentRepository.findByParentCommentIdOrderByCreatedAtAsc(c.getId()));
            commentTree.add(node);
        }

        boolean liked = false;
        if (currentUserId != null) {
            liked = likeRepository.findByUserIdAndPostId(currentUserId, postId).isPresent();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("post", post);
        result.put("comments", commentTree);
        result.put("liked", liked);
        return result;
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    public Post createPost(CreatePostRequest req, String userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Post post = Post.builder()
                .authorId(userId)
                .authorUsername(author.getUsername())
                .title(req.getTitle())
                .content(req.getContent())
                .status(req.getStatus() != null ? req.getStatus() : "draft")
                .tags(req.getTags() != null ? req.getTags() : new ArrayList<>())
                .build();

        if ("published".equals(post.getStatus())) {
            post.setPublishedAt(LocalDateTime.now());
        }

        return postRepository.save(post);
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public Post updatePost(String postId, UpdatePostRequest req, String userId, String role) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        boolean isModerator = "MODERATOR".equals(role);
        if (!post.getAuthorId().equals(userId) && !isModerator) {
            throw new AccessDeniedException("You can only edit your own posts");
        }

        if (req.getTitle() != null) post.setTitle(req.getTitle());
        if (req.getContent() != null) post.setContent(req.getContent());
        if (req.getTags() != null) post.setTags(req.getTags());
        if (req.getStatus() != null) {
            post.setStatus(req.getStatus());
            if ("published".equals(req.getStatus()) && post.getPublishedAt() == null) {
                post.setPublishedAt(LocalDateTime.now());
            }
        }
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    public void deletePost(String postId, String userId, String role) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        boolean isModerator = "MODERATOR".equals(role);
        if (!post.getAuthorId().equals(userId) && !isModerator) {
            throw new AccessDeniedException("You can only delete your own posts");
        }

        // Cascade delete comments
        commentRepository.findByPostId(postId).forEach(c -> commentRepository.delete(c));
        postRepository.delete(post);
    }
}