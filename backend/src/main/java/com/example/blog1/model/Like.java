package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "likes")
// This ensures a user can't like the same post twice [cite: 81, 645, 879]
@CompoundIndex(def = "{'user_id': 1, 'post_id': 1}", unique = true)
public class Like {
    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Field("post_id")
    private String postId;

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}