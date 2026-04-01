package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;

    @Field("post_id")
    private String postId;

    @Field("user_id")
    private String userId;

    @Field("parent_comment_id")
    private String parentCommentId; // Null for top-level comments

    private String content;

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}