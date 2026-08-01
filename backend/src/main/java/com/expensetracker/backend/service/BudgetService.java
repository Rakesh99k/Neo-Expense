package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.BudgetDtos.BudgetResponse;
import com.expensetracker.backend.dto.BudgetDtos.BudgetUpdateRequest;
import com.expensetracker.backend.model.Budget;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.Lending;
import com.expensetracker.backend.model.LendingStatus;
import com.expensetracker.backend.model.LendingType;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.LendingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final LendingRepository lendingRepository;
    private final CurrentUserService currentUserService;

    public BudgetService(
            BudgetRepository budgetRepository,
            ExpenseRepository expenseRepository,
            LendingRepository lendingRepository,
            CurrentUserService currentUserService
    ) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.lendingRepository = lendingRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public BudgetResponse get() {
        User user = currentUserService.getCurrentUser();
        Budget budget = getOrCreateBudget(user);

        BigDecimal spent = computeSpentThisMonth(user.getId());
        BigDecimal remaining = budget.getMonthlyAmount().subtract(spent);
        int daysLeft = daysLeftInMonth();
        String status = computeStatus(budget, spent);

        return new BudgetResponse(
                budget.isEnabled(),
                budget.getMonthlyAmount(),
                spent,
                remaining,
                daysLeft,
                status
        );
    }

    @Transactional
    public BudgetResponse update(BudgetUpdateRequest request) {
        User user = currentUserService.getCurrentUser();
        Budget budget = getOrCreateBudget(user);

        budget.setEnabled(request.enabled());
        budget.setMonthlyAmount(request.monthlyAmount());
        budget.setUpdatedAt(Instant.now());

        budgetRepository.save(budget);

        return get();
    }

    private Budget getOrCreateBudget(User user) {
        return budgetRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Budget b = Budget.builder()
                            .user(user)
                            .enabled(false)
                            .monthlyAmount(BigDecimal.ZERO)
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return budgetRepository.save(b);
                });
    }

    /**
     * Total money out this month =
     *   regular expenses this month
     * + active lent amounts (money we gave out, waiting to be returned)
     *
     * Excludes borrowed amounts (money coming in, not out).
     */
    private BigDecimal computeSpentThisMonth(Long userId) {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        Instant monthStart = now.withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant monthEnd = now.plusMonths(1).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        // Regular expenses
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        BigDecimal expenseTotal = expenses.stream()
                .filter(e -> !e.getDate().isBefore(monthStart) && e.getDate().isBefore(monthEnd))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Add lent-out amounts (only remaining, not what came back)
        List<Lending> lendings = lendingRepository.findAllByUserId(userId);
        BigDecimal lentThisMonth = lendings.stream()
                .filter(l -> LendingType.LENT.equals(l.getType()))
                .filter(l -> !LendingStatus.SETTLED.equals(l.getStatus()))
                .filter(l -> !l.getDate().isBefore(monthStart) && l.getDate().isBefore(monthEnd))
                .map(l -> l.getOriginalAmount().subtract(l.getReturnedAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return expenseTotal.add(lentThisMonth);
    }

    private int daysLeftInMonth() {
        LocalDate now = LocalDate.now(ZoneOffset.UTC);
        LocalDate lastDay = now.withDayOfMonth(now.lengthOfMonth());
        long days = ChronoUnit.DAYS.between(now, lastDay);
        return (int) days + 1;
    }

    private String computeStatus(Budget budget, BigDecimal spent) {
        if (!budget.isEnabled()) return "disabled";
        if (budget.getMonthlyAmount().compareTo(BigDecimal.ZERO) == 0) return "disabled";

        BigDecimal percentUsed = spent
                .multiply(BigDecimal.valueOf(100))
                .divide(budget.getMonthlyAmount(), 2, java.math.RoundingMode.HALF_UP);

        int pct = percentUsed.intValue();

        if (pct > 100) return "exceeded";
        if (pct >= 90) return "danger";
        if (pct >= 70) return "warning";
        return "ok";
    }
}