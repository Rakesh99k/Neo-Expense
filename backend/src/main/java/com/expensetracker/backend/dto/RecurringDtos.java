package com.expensetracker.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class RecurringDtos {

    public record RecurringRequest(
            @NotBlank(message = "Title is required")
            String title,

            @NotNull(message = "Amount is required")
            @Positive(message = "Amount must be positive")
            BigDecimal amount,

            @NotBlank(message = "Category is required")
            String category,

            @NotBlank(message = "Payment method is required")
            String paymentMethod,

            String notes,

            @NotBlank(message = "Frequency is required")
            String frequency,  // WEEKLY, MONTHLY, YEARLY

            // For MONTHLY: 1-31
            @Min(1) @Max(31)
            Integer dayOfMonth,

            // For WEEKLY: 1-7 (Mon-Sun)
            @Min(1) @Max(7)
            Integer dayOfWeek,

            // For YEARLY: 1-12
            @Min(1) @Max(12)
            Integer monthOfYear
    ) {}

    public record RecurringResponse(
            UUID id,
            String title,
            BigDecimal amount,
            String category,
            String paymentMethod,
            String notes,
            String frequency,
            Integer dayOfMonth,
            Integer dayOfWeek,
            Integer monthOfYear,
            boolean active,
            Instant lastGeneratedAt,
            Instant nextDueAt,
            Instant createdAt
    ) {}
}