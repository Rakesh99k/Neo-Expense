package com.expensetracker.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lending")
public class Lending {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // LENT or BORROWED
    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "person_name", nullable = false, length = 255)
    private String personName;

    @Column(name = "original_amount", precision = 19, scale = 4, nullable = false)
    private BigDecimal originalAmount;

    @Column(name = "returned_amount", precision = 19, scale = 4, nullable = false)
    @Builder.Default
    private BigDecimal returnedAmount = BigDecimal.ZERO;

    // ACTIVE, PARTIAL, SETTLED
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = LendingStatus.ACTIVE;

    @Column(length = 2048)
    private String notes;

    @Column(nullable = false)
    private Instant date;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "lending", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<LendingPayment> payments = new ArrayList<>();
}