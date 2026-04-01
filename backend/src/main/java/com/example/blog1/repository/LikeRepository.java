package com.example.blog1.repository;


import com.example.blog1.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    // Check if a user already liked a post [cite: 81, 771]
    Optional<Like> findByUserIdAndPostId(String userId, String postId);

    // Count likes for a post [cite: 53, 812-814]
    long countByPostId(String postId);
}