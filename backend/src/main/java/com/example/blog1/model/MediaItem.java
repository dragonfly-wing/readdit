package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Embedded subdocument inside Post.
 * Multimedia is tightly coupled to post lifecycle — always embedded.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaItem {

    @Id
    private String id;

    private String type; // "image" or "video"

    private String url; // required

    private String caption; // optional

    @Field("uploaded_at")
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}