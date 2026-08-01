package com.expensetracker.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class LendingDtos {

    // ── Request DTOs ──────────────────────────────────

    public record LendingRequest(
            @NotBlank(message = "Type is required")
            String type,  // LENT or BORROWED

            @NotBlank(message = "Person name is required")
            String personName,

            @NotNull(message = "Amount is required")
            @Positive(message = "Amount must be positive")
            BigDecimal originalAmount,

            String notes,

            @NotNull(message = "Date is required")
            Instant date
    ) {}

    public record PaymentRequest(
            @NotNull(message = "Amount is required")
            @Positive(message = "Amount must be positive")
            BigDecimal amount,

            @NotNull(message = "Date is required")
            Instant date,

            String notes
    ) {}

    // ── Response DTOs ─────────────────────────────────

    public record LendingResponse(
            UUID id,
            String type,
            String personName,
            BigDecimal originalAmount,
            BigDecimal returnedAmount,
            BigDecimal remainingAmount,
            String status,
            String notes,
            Instant date,
            Instant createdAt,
            Instant updatedAt,
            List<PaymentResponse> payments
    ) {}

    public record PaymentResponse(
            UUID id,
            BigDecimal amount,
            Instant date,
            String notes,
            Instant createdAt
    ) {}

    public record LendingSummaryResponse(
            BigDecimal totalLent,        // Total original amount lent
            BigDecimal totalBorrowed,    // Total original amount borrowed
            BigDecimal owedToYou,        // Active lent (remaining)
            BigDecimal youOwe,           // Active borrowed (remaining)
            BigDecimal netPosition,      // owedToYou - youOwe
            Integer activeLentCount,
            Integer activeBorrowedCount,
            List<String> knownPersons    // For autocomplete
    ) {}
}