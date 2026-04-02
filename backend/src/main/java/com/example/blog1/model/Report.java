package com.example.blog1.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reports")
public class Report {

    @Id
    private String id;

    private String type; // "post" or "comment"

    @Field("reporter_id")
    private String reporterId;

    @Field("reporter_username")
    private String reporterUsername;

    @Field("target_id")
    private String targetId; // ID of reported post or comment

    private String reason;

    private String description;

    @Builder.Default
    private String status = "pending"; // "pending", "resolved", "rejected"

    @Field("moderator_id")
    private String moderatorId; // filled when resolved

    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Field("resolved_at")
    private LocalDateTime resolvedAt;
}