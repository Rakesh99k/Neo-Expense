package com.expensetracker.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class SavingsDtos {

    public record SavingsResponse(
            BigDecimal totalSaved,
            BigDecimal currentMonthProjected,
            List<MonthlySavingItem> history
    ) {}

    public record MonthlySavingItem(
            Integer year,
            Integer month,
            String monthLabel,      // "October 2026"
            BigDecimal budgetAmount,
            BigDecimal spentAmount,
            BigDecimal savedAmount
    ) {}
}