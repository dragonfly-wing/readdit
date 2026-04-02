package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Separate collection for likes (M:N between Users and Posts).
 * Compound unique index on (user_id, post_id) enforces the constraint:
 * a user cannot like the same post more than once.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "likes")
@CompoundIndex(def = "{'user_id': 1, 'post_id': 1}", unique = true)
public class Like {

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("post_id")
    private String postId;

    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}