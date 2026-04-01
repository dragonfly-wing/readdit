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
@Document(collection = "follow")
// Prevents duplicate follow relationships [cite: 82, 648, 881]
@CompoundIndex(def = "{'follower_id': 1, 'following_id': 1}", unique = true)
public class Follow {
    @Id
    private String id;

    @Field("follower_id")
    private String followerId;

    @Field("following_id")
    private String followingId;

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}