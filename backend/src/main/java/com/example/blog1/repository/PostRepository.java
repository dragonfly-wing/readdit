package com.example.blog1.repository;

import com.example.blog1.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    // Feed: latest published posts
    List<Post> findByStatusOrderByCreatedAtDesc(String status);

    // Feed with pagination
    Page<Post> findByStatus(String status, Pageable pageable);

    // Posts by a specific user
    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);

    // Filter by tag
    List<Post> findByTagsContainingAndStatus(String tag, String status);

    // Moderator: all posts by status (including drafts, archived)
    List<Post> findByStatus(String status);
}