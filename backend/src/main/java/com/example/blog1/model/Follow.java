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
 * Separate collection for follow relationships (M:N between Users).
 * Compound unique index enforces: a user cannot follow the same user more than once.
 * follower_id != following_id enforced at service layer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "follow")
@CompoundIndex(def = "{'follower_id': 1, 'following_id': 1}", unique = true)
public class Follow {

    @Id
    private String id;

    @Field("follower_id")
    private String followerId;

    @Field("following_id")
    private String followingId;

    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}