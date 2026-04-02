package com.example.blog1.service;

import com.example.blog1.dto.Dto.*;
import com.example.blog1.model.Report;
import com.example.blog1.model.User;
import com.example.blog1.repository.ReportRepository;
import com.example.blog1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReportService {

    @Autowired private ReportRepository reportRepository;
    @Autowired private UserRepository userRepository;

    public Report createReport(CreateReportRequest req, String reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Report report = Report.builder()
                .type(req.getType())
                .reporterId(reporterId)
                .reporterUsername(reporter.getUsername())
                .targetId(req.getTargetId())
                .reason(req.getReason())
                .description(req.getDescription())
                .status("pending")
                .build();

        return reportRepository.save(report);
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatus("pending");
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report resolveReport(String reportId, ResolveReportRequest req, String moderatorId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new NoSuchElementException("Report not found"));

        report.setStatus(req.getAction()); // "resolved" or "rejected"
        report.setModeratorId(moderatorId);
        report.setResolvedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }
}