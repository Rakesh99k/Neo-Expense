package com.expensetracker.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class ExpenseDtos {
    public record ExpenseRequest(
            @NotBlank String title,
            @Positive BigDecimal amount,
            @NotBlank String category,
            @NotNull Instant date,
            String notes
    ) {}

    public record ExpenseResponse(
            UUID id,
            String title,
            BigDecimal amount,
            String category,
            Instant date,
            String notes
    ) {}
}

