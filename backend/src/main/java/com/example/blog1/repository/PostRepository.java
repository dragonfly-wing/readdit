package com.example.blog1.repository;

import com.example.blog1.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    // Primary query: Latest published posts [cite: 38, 780-783]
    List<Post> findByStatusOrderByCreatedAtDesc(String status);

    // Secondary query: Posts by author [cite: 37, 784-786]
    List<Post> findByAuthorIdOrderByCreatedAtDesc(String authorId);

    // Filter posts by tag [cite: 39, 824-826]
    List<Post> findByTagsContaining(String tag);
}