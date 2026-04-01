package com.example.blog1.repository;


import com.example.blog1.model.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {
    // Moderator query: View pending reports [cite: 58, 69, 83]
    List<Report> findByStatus(String status);
}