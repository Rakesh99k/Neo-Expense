package com.expensetracker.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class BudgetDtos {

    public record BudgetResponse(
            boolean enabled,
            BigDecimal monthlyAmount,
            BigDecimal currentMonthSpent,
            BigDecimal currentMonthRemaining,
            Integer daysLeftInMonth,
            String status  // "ok", "warning", "danger", "exceeded", "disabled"
    ) {}

    public record BudgetUpdateRequest(
            @NotNull(message = "Enabled flag is required")
            Boolean enabled,

            @NotNull(message = "Monthly amount is required")
            @PositiveOrZero(message = "Monthly amount must be zero or positive")
            BigDecimal monthlyAmount
    ) {}
}