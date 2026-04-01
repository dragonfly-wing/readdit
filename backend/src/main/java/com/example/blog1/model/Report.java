package com.example.blog1.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Data
@Document(collection = "reports")
public class Report {
    @Id
    private String id;

    private String type; // "post" or "comment" [cite: 652]

    @Field("reporter_id")
    private String reporterId;

    @Field("target_id")
    private String targetId; // ID of the reported content

    private String reason;
    private String status; // "pending", "resolved" [cite: 653]

    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}