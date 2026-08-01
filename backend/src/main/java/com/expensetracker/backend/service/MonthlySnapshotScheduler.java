package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Budget;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.MonthlySnapshot;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.BudgetRepository;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.MonthlySnapshotRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Runs on the 1st of every month at 02:00 UTC.
 * Snapshots the PREVIOUS month's budget vs spending for each user.
 * Result becomes savings history.
 */
@Component
public class MonthlySnapshotScheduler {

    private static final Logger log = LoggerFactory.getLogger(MonthlySnapshotScheduler.class);

    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final MonthlySnapshotRepository snapshotRepository;

    public MonthlySnapshotScheduler(
            UserRepository userRepository,
            BudgetRepository budgetRepository,
            ExpenseRepository expenseRepository,
            MonthlySnapshotRepository snapshotRepository
    ) {
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.snapshotRepository = snapshotRepository;
    }

    /**
     * Runs at 02:00 UTC on the 1st day of every month.
     */
    @Scheduled(cron = "0 0 2 1 * *", zone = "UTC")
    @Transactional
    public void finalizePreviousMonth() {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate prevMonth = today.minusMonths(1);
        int year = prevMonth.getYear();
        int month = prevMonth.getMonthValue();

        log.info("[SnapshotScheduler] Finalizing {}/{}", month, year);

        List<User> users = userRepository.findAll();
        for (User user : users) {
            try {
                createSnapshotIfMissing(user, year, month);
            } catch (Exception e) {
                log.error("[SnapshotScheduler] Failed for user {}: {}",
                        user.getId(), e.getMessage());
            }
        }
    }

    private void createSnapshotIfMissing(User user, int year, int month) {
        boolean exists = snapshotRepository
                .findByUserIdAndYearAndMonth(user.getId(), year, month)
                .isPresent();
        if (exists) return;

        Budget budget = budgetRepository.findByUserId(user.getId()).orElse(null);
        if (budget == null || !budget.isEnabled()) return;
        if (budget.getMonthlyAmount().compareTo(BigDecimal.ZERO) == 0) return;

        // Sum expenses in that month
        LocalDate monthStart = LocalDate.of(year, month, 1);
        LocalDate monthEnd = monthStart.plusMonths(1);
        Instant startInstant = monthStart.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant endInstant = monthEnd.atStartOfDay().toInstant(ZoneOffset.UTC);

        List<Expense> expenses = expenseRepository.findByUserId(user.getId());
        BigDecimal spent = expenses.stream()
                .filter(e -> !e.getDate().isBefore(startInstant) && e.getDate().isBefore(endInstant))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saved = budget.getMonthlyAmount().subtract(spent);
        if (saved.compareTo(BigDecimal.ZERO) < 0) saved = BigDecimal.ZERO;

        MonthlySnapshot snap = MonthlySnapshot.builder()
                .user(user)
                .year(year)
                .month(month)
                .budgetAmount(budget.getMonthlyAmount())
                .spentAmount(spent)
                .savedAmount(saved)
                .finalizedAt(Instant.now())
                .build();

        snapshotRepository.save(snap);
        log.info("[SnapshotScheduler] Snapshot saved for user {} {}/{} — saved ₹{}",
                user.getId(), month, year, saved);
    }
}