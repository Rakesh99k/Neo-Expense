package com.expensetracker.backend.dto; // Package: DTOs for API request/response payloads

import jakarta.validation.constraints.NotBlank; // Bean Validation: enforce non-blank strings
import jakarta.validation.constraints.NotNull; // Bean Validation: enforce non-null values
import jakarta.validation.constraints.Positive; // Bean Validation: enforce positive numbers

import java.math.BigDecimal; // Type for precise monetary values
import java.time.Instant; // Type representing a timestamp
import java.util.UUID; // Type representing unique identifier

public class ExpenseDtos { // Container class to group related records
    public record ExpenseRequest( // Record: immutable request payload for creating/updating expenses
            @NotBlank String title, // Validation: title must be provided and not blank
            @Positive BigDecimal amount, // Validation: amount must be positive
            @NotBlank String category, // Validation: category must be provided and not blank
            @NotNull Instant date, // Validation: date must be provided
            String notes // Optional notes field (no validation)
    ) {}

    public record ExpenseResponse( // Record: immutable response payload representing an expense
            UUID id, // Unique identifier of expense
            String title, // Title/description
            BigDecimal amount, // Monetary amount
            String category, // Category label
            Instant date, // Occurrence timestamp
            String notes // Optional notes
    ) {}
}
