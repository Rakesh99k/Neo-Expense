package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.RecurringDtos.RecurringRequest;
import com.expensetracker.backend.dto.RecurringDtos.RecurringResponse;
import com.expensetracker.backend.exception.EntityNotFoundException;
import com.expensetracker.backend.model.PaymentMethod;
import com.expensetracker.backend.model.RecurringExpense;
import com.expensetracker.backend.model.RecurringFrequency;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.RecurringExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
public class RecurringService {

    private final RecurringExpenseRepository recurringRepository;
    private final CurrentUserService currentUserService;

    public RecurringService(
            RecurringExpenseRepository recurringRepository,
            CurrentUserService currentUserService
    ) {
        this.recurringRepository = recurringRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public List<RecurringResponse> list() {
        User user = currentUserService.getCurrentUser();
        return recurringRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RecurringResponse add(RecurringRequest request) {
        User user = currentUserService.getCurrentUser();
        validate(request);

        RecurringExpense r = RecurringExpense.builder()
                .user(user)
                .title(request.title().trim())
                .amount(request.amount())
                .category(request.category().trim())
                .paymentMethod(normalizePaymentMethod(request.paymentMethod()))
                .notes(request.notes())
                .frequency(request.frequency())
                .dayOfMonth(request.dayOfMonth())
                .dayOfWeek(request.dayOfWeek())
                .monthOfYear(request.monthOfYear())
                .active(true)
                .nextDueAt(computeNextDueAt(request, Instant.now()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return toResponse(recurringRepository.save(r));
    }

    @Transactional
    public RecurringResponse update(UUID id, RecurringRequest request) {
        User user = currentUserService.getCurrentUser();
        RecurringExpense r = findOwnedById(id, user);
        validate(request);

        r.setTitle(request.title().trim());
        r.setAmount(request.amount());
        r.setCategory(request.category().trim());
        r.setPaymentMethod(normalizePaymentMethod(request.paymentMethod()));
        r.setNotes(request.notes());
        r.setFrequency(request.frequency());
        r.setDayOfMonth(request.dayOfMonth());
        r.setDayOfWeek(request.dayOfWeek());
        r.setMonthOfYear(request.monthOfYear());
        r.setNextDueAt(computeNextDueAt(request, Instant.now()));
        r.setUpdatedAt(Instant.now());

        return toResponse(recurringRepository.save(r));
    }

    @Transactional
    public void delete(UUID id) {
        User user = currentUserService.getCurrentUser();
        RecurringExpense r = findOwnedById(id, user);
        recurringRepository.delete(r);
    }

    @Transactional
    public RecurringResponse setActive(UUID id, boolean active) {
        User user = currentUserService.getCurrentUser();
        RecurringExpense r = findOwnedById(id, user);
        r.setActive(active);
        r.setUpdatedAt(Instant.now());
        return toResponse(recurringRepository.save(r));
    }

    private RecurringExpense findOwnedById(UUID id, User user) {
        RecurringExpense r = recurringRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Recurring expense not found"));
        if (!r.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cannot access another user's recurring expense");
        }
        return r;
    }

    private void validate(RecurringRequest request) {
        String freq = request.frequency();
        if (!RecurringFrequency.ALL.contains(freq)) {
            throw new IllegalArgumentException("Invalid frequency: must be WEEKLY, MONTHLY, or YEARLY");
        }
        if (freq.equals(RecurringFrequency.MONTHLY) && request.dayOfMonth() == null) {
            throw new IllegalArgumentException("Day of month required for MONTHLY frequency");
        }
        if (freq.equals(RecurringFrequency.WEEKLY) && request.dayOfWeek() == null) {
            throw new IllegalArgumentException("Day of week required for WEEKLY frequency");
        }
        if (freq.equals(RecurringFrequency.YEARLY)) {
            if (request.dayOfMonth() == null || request.monthOfYear() == null) {
                throw new IllegalArgumentException("Day of month and month of year required for YEARLY");
            }
        }
    }

    private String normalizePaymentMethod(String method) {
        if (method == null || method.isBlank()) return PaymentMethod.CASH;
        String upper = method.trim().toUpperCase();
        return PaymentMethod.ALL.contains(upper) ? upper : PaymentMethod.CASH;
    }

    /**
     * Compute next due date.
     * CHANGED: If target day is TODAY, schedule for today (not next cycle).
     * The scheduler will pick it up on today's run.
     */
    static Instant computeNextDueAt(RecurringRequest r, Instant from) {
        LocalDate today = LocalDate.ofInstant(from, ZoneOffset.UTC);
        LocalDate next;

        switch (r.frequency()) {
            case RecurringFrequency.WEEKLY -> {
                int targetDow = r.dayOfWeek();
                int currentDow = today.getDayOfWeek().getValue();
                int daysUntil = (targetDow - currentDow + 7) % 7;
                // Include today (daysUntil = 0 means schedule for today)
                next = today.plusDays(daysUntil);
            }
            case RecurringFrequency.MONTHLY -> {
                int targetDom = Math.min(r.dayOfMonth(), today.lengthOfMonth());
                LocalDate thisMonth = today.withDayOfMonth(targetDom);
                // Include today (>= instead of >)
                if (!thisMonth.isBefore(today)) {
                    next = thisMonth;
                } else {
                    LocalDate nextMonth = today.plusMonths(1);
                    int dom = Math.min(r.dayOfMonth(), nextMonth.lengthOfMonth());
                    next = nextMonth.withDayOfMonth(dom);
                }
            }
            case RecurringFrequency.YEARLY -> {
                int targetMonth = r.monthOfYear();
                int targetDom = r.dayOfMonth();
                LocalDate thisYear = LocalDate.of(today.getYear(), targetMonth, 1);
                int dom = Math.min(targetDom, thisYear.lengthOfMonth());
                thisYear = thisYear.withDayOfMonth(dom);
                // Include today
                if (!thisYear.isBefore(today)) {
                    next = thisYear;
                } else {
                    LocalDate nextYear = LocalDate.of(today.getYear() + 1, targetMonth, 1);
                    dom = Math.min(targetDom, nextYear.lengthOfMonth());
                    next = nextYear.withDayOfMonth(dom);
                }
            }
            default -> throw new IllegalArgumentException("Unknown frequency");
        }

        return next.atStartOfDay().toInstant(ZoneOffset.UTC);
    }

    private RecurringResponse toResponse(RecurringExpense r) {
        return new RecurringResponse(
                r.getId(),
                r.getTitle(),
                r.getAmount(),
                r.getCategory(),
                r.getPaymentMethod(),
                r.getNotes(),
                r.getFrequency(),
                r.getDayOfMonth(),
                r.getDayOfWeek(),
                r.getMonthOfYear(),
                r.isActive(),
                r.getLastGeneratedAt(),
                r.getNextDueAt(),
                r.getCreatedAt()
        );
    }
}