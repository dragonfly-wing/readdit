package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    @Field("author_id")
    private String authorId;

    /**
     * Denormalized for read performance — avoids joining users collection on every feed load.
     * Kept consistent via application-level updates when username changes.
     */
    @Field("author_username")
    private String authorUsername;

    private String title;

    private String content;

    @Builder.Default
    private String status = "draft"; // "draft", "published", "archived"

    /** Embedded tags array — bounded, always fetched with post */
    @Builder.Default
    @Indexed
    private List<String> tags = new ArrayList<>();

    /** Embedded media — tightly coupled to post lifecycle */
    @Builder.Default
    private List<MediaItem> media = new ArrayList<>();

    /**
     * Denormalized counter — avoids COUNT(*) aggregation on every post read.
     * Incremented/decremented atomically via $inc.
     */
    @Field("like_count")
    @Builder.Default
    private int likeCount = 0;

    /**
     * Denormalized counter — same rationale as like_count.
     */
    @Field("comment_count")
    @Builder.Default
    private int commentCount = 0;

    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Field("published_at")
    private LocalDateTime publishedAt;
}