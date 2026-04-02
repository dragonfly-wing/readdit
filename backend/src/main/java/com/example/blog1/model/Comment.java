package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Stored as a separate collection (not embedded in Post) to:
 * - Support scalability (popular posts can have thousands of comments)
 * - Allow independent pagination
 * - Avoid MongoDB's document size limit on the Post document
 *
 * Hierarchical threading via self-referencing parent_comment_id.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    @Field("post_id")
    private String postId;

    @Field("user_id")
    private String userId;

    @Field("author_username")
    private String authorUsername; // denormalized for display

    /** Null for top-level comments; references another comment for replies */
    @Field("parent_comment_id")
    private String parentCommentId;

    private String content;

    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}