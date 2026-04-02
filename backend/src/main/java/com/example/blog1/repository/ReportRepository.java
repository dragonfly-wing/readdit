package com.example.blog1.repository;

import com.example.blog1.model.Report;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByStatus(String status);
    List<Report> findByReporterId(String reporterId);
    List<Report> findByTargetId(String targetId);
}