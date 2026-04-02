package com.example.blog1.repository;

import com.example.blog1.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    Optional<Like> findByUserIdAndPostId(String userId, String postId);
    long countByPostId(String postId);
    List<Like> findByUserId(String userId);
    void deleteByUserIdAndPostId(String userId, String postId);
}