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
@Table(
        name = "monthly_snapshots",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "snapshot_year", "snapshot_month"})
)
public class MonthlySnapshot {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Renamed from 'year' to avoid H2/PostgreSQL reserved word issue
    @Column(name = "snapshot_year", nullable = false)
    private Integer year;

    // Renamed from 'month' to avoid H2/PostgreSQL reserved word issue
    @Column(name = "snapshot_month", nullable = false)
    private Integer month;

    @Column(name = "budget_amount", precision = 19, scale = 4, nullable = false)
    private BigDecimal budgetAmount;

    @Column(name = "spent_amount", precision = 19, scale = 4, nullable = false)
    private BigDecimal spentAmount;

    @Column(name = "saved_amount", precision = 19, scale = 4, nullable = false)
    private BigDecimal savedAmount;

    @Column(name = "finalized_at", nullable = false)
    private Instant finalizedAt;
}