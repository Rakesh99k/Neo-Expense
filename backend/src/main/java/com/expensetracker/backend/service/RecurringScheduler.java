package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.RecurringExpense;
import com.expensetracker.backend.model.RecurringFrequency;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.RecurringExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Component
public class RecurringScheduler {

    private static final Logger log = LoggerFactory.getLogger(RecurringScheduler.class);

    private final RecurringExpenseRepository recurringRepository;
    private final ExpenseRepository expenseRepository;

    public RecurringScheduler(
            RecurringExpenseRepository recurringRepository,
            ExpenseRepository expenseRepository
    ) {
        this.recurringRepository = recurringRepository;
        this.expenseRepository = expenseRepository;
    }

    /**
     * Runs every day at 01:00 UTC (~06:30 IST).
     */
    @Scheduled(cron = "0 0 1 * * *", zone = "UTC")
    @Transactional
    public void generateDueExpenses() {
        Instant now = Instant.now();
        log.info("[RecurringScheduler] Running at {}", now);

        List<RecurringExpense> due = recurringRepository.findDueForGeneration(now);
        log.info("[RecurringScheduler] Found {} due recurring items", due.size());

        for (RecurringExpense r : due) {
            try {
                generateForOne(r, now);
            } catch (Exception e) {
                log.error("[RecurringScheduler] Failed for id {}: {}", r.getId(), e.getMessage());
            }
        }
    }

    /**
     * Manually trigger generation for one recurring template.
     * Creates ONE expense right now with today's date.
     * Does not touch the schedule — next scheduled run happens as normal.
     */
    @Transactional
    public void generateNow(UUID recurringId) {
        RecurringExpense r = recurringRepository.findById(recurringId)
                .orElseThrow(() -> new RuntimeException("Recurring not found"));

        Instant now = Instant.now();

        Expense e = Expense.builder()
                .title(r.getTitle())
                .amount(r.getAmount())
                .category(r.getCategory())
                .paymentMethod(r.getPaymentMethod())
                .notes(r.getNotes())
                .date(now)
                .user(r.getUser())
                .recurringId(r.getId())
                .build();

        expenseRepository.save(e);

        r.setLastGeneratedAt(now);
        r.setUpdatedAt(now);
        recurringRepository.save(r);

        log.info("[RecurringScheduler] Manual generation for template {} — created expense", r.getId());
    }

    private void generateForOne(RecurringExpense r, Instant now) {
        Instant due = r.getNextDueAt();
        int safetyCounter = 0;

        while (!due.isAfter(now) && safetyCounter < 12) {
            createExpenseFromTemplate(r, due);
            due = computeNextOccurrence(r, due);
            safetyCounter++;
        }

        r.setLastGeneratedAt(now);
        r.setNextDueAt(due);
        r.setUpdatedAt(now);
        recurringRepository.save(r);

        log.info("[RecurringScheduler] Generated {} for template {}", safetyCounter, r.getId());
    }

    private void createExpenseFromTemplate(RecurringExpense r, Instant occurrenceDate) {
        Expense e = Expense.builder()
                .title(r.getTitle())
                .amount(r.getAmount())
                .category(r.getCategory())
                .paymentMethod(r.getPaymentMethod())
                .notes(r.getNotes())
                .date(occurrenceDate)
                .user(r.getUser())
                .recurringId(r.getId())
                .build();

        expenseRepository.save(e);
    }

    private Instant computeNextOccurrence(RecurringExpense r, Instant currentDue) {
        LocalDate date = LocalDate.ofInstant(currentDue, ZoneOffset.UTC);
        LocalDate next;

        switch (r.getFrequency()) {
            case RecurringFrequency.WEEKLY -> next = date.plusWeeks(1);
            case RecurringFrequency.MONTHLY -> {
                LocalDate nextMonth = date.plusMonths(1);
                int targetDom = Math.min(r.getDayOfMonth(), nextMonth.lengthOfMonth());
                next = nextMonth.withDayOfMonth(targetDom);
            }
            case RecurringFrequency.YEARLY -> {
                LocalDate nextYear = date.plusYears(1);
                int targetDom = Math.min(r.getDayOfMonth(), nextYear.lengthOfMonth());
                next = nextYear.withDayOfMonth(targetDom);
            }
            default -> throw new IllegalStateException("Unknown frequency");
        }

        return next.atStartOfDay().toInstant(ZoneOffset.UTC);
    }
}