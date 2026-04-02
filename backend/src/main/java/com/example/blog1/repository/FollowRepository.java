package com.example.blog1.repository;

import com.example.blog1.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends MongoRepository<Follow, String> {
    List<Follow> findByFollowingId(String followingId); // followers of a user
    List<Follow> findByFollowerId(String followerId);   // who a user follows
    Optional<Follow> findByFollowerIdAndFollowingId(String followerId, String followingId);
    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);
    long countByFollowingId(String followingId);
    long countByFollowerId(String followerId);
}