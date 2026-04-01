package com.example.blog1.service;

import com.example.blog1.model.Comment;
import com.example.blog1.model.Post;
import com.example.blog1.repository.CommentRepository;
import com.example.blog1.repository.PostRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository,
                       CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    public Map<String, Object> getPostWithComments(String postId) {

        // 🔥 Convert String → ObjectId
        ObjectId objId = new ObjectId(postId);

        // 📌 Fetch post
        Post post = postRepository.findById(postId).orElse(null);

        // 📌 Fetch top-level comments
        List<Comment> topComments =
                commentRepository.findByPostIdAndParentCommentIdIsNull(objId);

        List<Map<String, Object>> commentTree = new ArrayList<>();

        for (Comment c : topComments) {

            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("comment", c);

            // 📌 Fetch replies for this comment
            List<Comment> replies =
                    commentRepository.findByParentCommentId(
                            new ObjectId(c.getId())
                    );

            commentMap.put("replies", replies);

            commentTree.add(commentMap);
        }

        // 📌 Final response
        Map<String, Object> result = new HashMap<>();
        result.put("post", post);
        result.put("comments", commentTree);

        return result;
    }
}