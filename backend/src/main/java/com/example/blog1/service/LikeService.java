package com.example.blog1.service;

import com.example.blog1.dto.Dto.LikeStatusResponse;
import com.example.blog1.model.Like;
import com.example.blog1.model.Post;
import com.example.blog1.repository.LikeRepository;
import com.example.blog1.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired private LikeRepository likeRepository;
    @Autowired private PostRepository postRepository;
    @Autowired private MongoTemplate mongoTemplate;

    public LikeStatusResponse toggleLike(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        Optional<Like> existing = likeRepository.findByUserIdAndPostId(userId, postId);

        boolean nowLiked;
        if (existing.isPresent()) {
            // Unlike
            likeRepository.delete(existing.get());
            mongoTemplate.updateFirst(
                    Query.query(Criteria.where("_id").is(postId)),
                    new Update().inc("like_count", -1),
                    Post.class
            );
            nowLiked = false;
        } else {
            // Like
            likeRepository.save(Like.builder().userId(userId).postId(postId).build());
            mongoTemplate.updateFirst(
                    Query.query(Criteria.where("_id").is(postId)),
                    new Update().inc("like_count", 1),
                    Post.class
            );
            nowLiked = true;
        }

        Post updated = postRepository.findById(postId).orElse(post);
        return new LikeStatusResponse(nowLiked, updated.getLikeCount());
    }

    public LikeStatusResponse getStatus(String postId, String userId) {
        boolean liked = userId != null &&
                likeRepository.findByUserIdAndPostId(userId, postId).isPresent();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));
        return new LikeStatusResponse(liked, post.getLikeCount());
    }
}