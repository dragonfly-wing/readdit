package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;

    @Field("author_id")
    private String authorId;

    private String title;
    private String content;
    private String status; // "published", "draft"

    private List<String> tags; // Your embedded array

    @Field("like_count")
    private int likeCount = 0;

    @Field("comment_count")
    private int commentCount = 0;

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}