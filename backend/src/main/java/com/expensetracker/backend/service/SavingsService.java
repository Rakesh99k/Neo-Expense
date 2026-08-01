package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.SavingsDtos.MonthlySavingItem;
import com.expensetracker.backend.dto.SavingsDtos.SavingsResponse;
import com.expensetracker.backend.model.Budget;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.MonthlySnapshot;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.MonthlySnapshotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class SavingsService {

    private final MonthlySnapshotRepository snapshotRepository;
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final CurrentUserService currentUserService;

    public SavingsService(
            MonthlySnapshotRepository snapshotRepository,
            BudgetRepository budgetRepository,
            ExpenseRepository expenseRepository,
            CurrentUserService currentUserService
    ) {
        this.snapshotRepository = snapshotRepository;
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public SavingsResponse get() {
        User user = currentUserService.getCurrentUser();

        // Historical snapshots
        List<MonthlySnapshot> snapshots = snapshotRepository
                .findAllByUserIdOrderByDateDesc(user.getId());

        BigDecimal totalSaved = snapshots.stream()
                .map(MonthlySnapshot::getSavedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Current month projected savings
        BigDecimal currentProjected = computeCurrentMonthProjectedSavings(user);

        List<MonthlySavingItem> history = snapshots.stream()
                .map(this::toItem)
                .toList();

        return new SavingsResponse(totalSaved, currentProjected, history);
    }

    private BigDecimal computeCurrentMonthProjectedSavings(User user) {
        Budget budget = budgetRepository.findByUserId(user.getId()).orElse(null);
        if (budget == null || !budget.isEnabled()) return BigDecimal.ZERO;

        BigDecimal spent = computeSpentThisMonth(user.getId());
        BigDecimal projected = budget.getMonthlyAmount().subtract(spent);
        return projected.compareTo(BigDecimal.ZERO) > 0 ? projected : BigDecimal.ZERO;
    }

    private BigDecimal computeSpentThisMonth(Long userId) {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        Instant monthStart = now.withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant monthEnd = now.plusMonths(1).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return expenses.stream()
                .filter(e -> !e.getDate().isBefore(monthStart) && e.getDate().isBefore(monthEnd))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private MonthlySavingItem toItem(MonthlySnapshot s) {
        String monthLabel = Month.of(s.getMonth()).name();
        String label = capitalize(monthLabel) + " " + s.getYear();
        return new MonthlySavingItem(
                s.getYear(),
                s.getMonth(),
                label,
                s.getBudgetAmount(),
                s.getSpentAmount(),
                s.getSavedAmount()
        );
    }

    private String capitalize(String s) {
        return s.charAt(0) + s.substring(1).toLowerCase();
    }
}