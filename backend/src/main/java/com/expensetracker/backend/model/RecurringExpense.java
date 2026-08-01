package com.expensetracker.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * A template for expenses that repeat.
 * Backend scheduler creates real Expense entries based on this.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "recurring_expenses")
public class RecurringExpense {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(precision = 19, scale = 4, nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 255)
    private String category;

    @Column(name = "payment_method", nullable = false, length = 50)
    @Builder.Default
    private String paymentMethod = PaymentMethod.CASH;

    @Column(length = 2048)
    private String notes;

    // WEEKLY, MONTHLY, YEARLY
    @Column(nullable = false, length = 20)
    private String frequency;

    // For MONTHLY: 1-31 (day of month, e.g., 15 = every 15th)
    @Column(name = "day_of_month")
    private Integer dayOfMonth;

    // For WEEKLY: 1-7 (1=Monday, 7=Sunday)
    @Column(name = "day_of_week")
    private Integer dayOfWeek;

    // For YEARLY: 1-12 (month of year)
    @Column(name = "month_of_year")
    private Integer monthOfYear;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "last_generated_at")
    private Instant lastGeneratedAt;

    @Column(name = "next_due_at", nullable = false)
    private Instant nextDueAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}