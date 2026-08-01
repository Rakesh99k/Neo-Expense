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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    @Column(precision = 19, scale = 4)
    private BigDecimal amount;

    private String category;

    @Column(nullable = false)
    private Instant date;

    @Column(length = 2048)
    private String notes;

    // NEW: Payment method (CASH, DEBIT_UPI, CREDIT_CARD, WALLET, etc.)
    @Column(name = "payment_method", nullable = false, length = 50)
    @Builder.Default
    private String paymentMethod = PaymentMethod.CASH;

    // NEW: If auto-generated from a recurring template, this points to it
    @Column(name = "recurring_id")
    private UUID recurringId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}