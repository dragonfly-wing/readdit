package com.example.blog1.repository;

import com.example.blog1.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    // Top-level comments for a post (no parent)
    List<Comment> findByPostIdAndParentCommentIdIsNullOrderByCreatedAtAsc(String postId);

    // Top-level with pagination
    Page<Comment> findByPostIdAndParentCommentIdIsNull(String postId, Pageable pageable);

    // Replies to a comment
    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(String parentCommentId);

    // All comments for a post (used for deletion cascade)
    List<Comment> findByPostId(String postId);

    // Comments by a user
    List<Comment> findByUserId(String userId);
}