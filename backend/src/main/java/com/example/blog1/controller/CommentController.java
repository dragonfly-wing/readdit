package com.example.blog1.controller;

import com.example.blog1.model.Comment;
import com.example.blog1.repository.CommentRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // ✅ Get top-level comments for a post
    @GetMapping("/post/{postId}")
    public List<Comment> getTopLevelComments(@PathVariable String postId) {
        return commentRepository.findByPostIdAndParentCommentIdIsNull(
                new ObjectId(postId)
        );
    }

    // ✅ Get replies for a comment
    @GetMapping("/replies/{parentId}")
    public List<Comment> getReplies(@PathVariable String parentId) {
        return commentRepository.findByParentCommentId(
                new ObjectId(parentId)
        );
    }
}