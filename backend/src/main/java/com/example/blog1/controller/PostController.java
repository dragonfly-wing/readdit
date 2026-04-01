package com.example.blog1.controller;

import com.example.blog1.model.Post;
import com.example.blog1.repository.PostRepository;
import com.example.blog1.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostService postService;

    // 📌 1. THE FEED: React needs this for the main page!
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 📌 2. THE THREAD: Use this when a user clicks a post
    @GetMapping("/{id}")
    public Map<String, Object> getPostWithComments(@PathVariable String id) {
        return postService.getPostWithComments(id);
    }
}