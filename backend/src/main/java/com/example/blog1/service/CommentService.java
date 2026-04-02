package com.example.blog1.service;

import com.example.blog1.dto.Dto.*;
import com.example.blog1.model.Comment;
import com.example.blog1.model.Post;
import com.example.blog1.model.User;
import com.example.blog1.repository.CommentRepository;
import com.example.blog1.repository.PostRepository;
import com.example.blog1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CommentService {

    @Autowired private CommentRepository commentRepository;
    @Autowired private PostRepository postRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private MongoTemplate mongoTemplate;

    public List<Comment> getCommentsForPost(String postId) {
        return commentRepository.findByPostIdAndParentCommentIdIsNullOrderByCreatedAtAsc(postId);
    }

    public List<Comment> getReplies(String parentCommentId) {
        return commentRepository.findByParentCommentIdOrderByCreatedAtAsc(parentCommentId);
    }

    public Comment addComment(String postId, CreateCommentRequest req, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        // Validate parent exists if provided
        if (req.getParentCommentId() != null) {
            commentRepository.findById(req.getParentCommentId())
                    .orElseThrow(() -> new NoSuchElementException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .postId(postId)
                .userId(userId)
                .authorUsername(user.getUsername())
                .parentCommentId(req.getParentCommentId())
                .content(req.getContent())
                .build();

        Comment saved = commentRepository.save(comment);

        // Atomically increment comment_count on the post
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").is(postId)),
                new Update().inc("comment_count", 1),
                Post.class
        );

        return saved;
    }

    public Comment updateComment(String commentId, UpdateCommentRequest req, String userId, String role) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));

        if (!comment.getUserId().equals(userId) && !"MODERATOR".equals(role)) {
            throw new AccessDeniedException("You can only edit your own comments");
        }

        comment.setContent(req.getContent());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId, String role) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found"));

        if (!comment.getUserId().equals(userId) && !"MODERATOR".equals(role)) {
            throw new AccessDeniedException("You can only delete your own comments");
        }

        // Decrement comment_count
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").is(comment.getPostId())),
                new Update().inc("comment_count", -1),
                Post.class
        );

        commentRepository.delete(comment);
    }
}