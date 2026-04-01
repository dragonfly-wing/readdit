package com.example.blog1.repository;


import com.example.blog1.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FollowRepository extends MongoRepository<Follow, String> {
    // Get follower list [cite: 26, 55, 820-823]
    List<Follow> findByFollowingId(String followingId);

    // Get following list [cite: 27, 55]
    List<Follow> findByFollowerId(String followerId);
}