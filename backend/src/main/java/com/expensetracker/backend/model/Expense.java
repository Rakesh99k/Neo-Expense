package com.expensetracker.backend.model; // Package declaration defines the namespace for this class

import jakarta.persistence.*; // Imports JPA annotations for ORM (Entity, Id, Column, etc.)
import lombok.AllArgsConstructor; // Lombok: generates a constructor with all fields
import lombok.Builder; // Lombok: enables the builder pattern for creating instances
import lombok.Data; // Lombok: auto-generates getters, setters, equals, hashCode, toString
import lombok.NoArgsConstructor; // Lombok: generates a no-arguments constructor

import java.math.BigDecimal; // BigDecimal for precise decimal monetary values
import java.time.Instant; // Instant for timestamp of the expense date
import java.util.UUID; // UUID type for unique identifier of the expense

@Data // Lombok: generate boilerplate methods
@Builder // Lombok: enable fluent builder API
@NoArgsConstructor // Lombok: provide no-args constructor
@AllArgsConstructor // Lombok: provide all-args constructor
@Entity // JPA: mark class as a database entity
@Table(name = "expenses") // JPA: map to table named "expenses"
public class Expense { // Class representing an expense record
    @Id // JPA: marks primary key field
    @GeneratedValue // JPA: auto-generate UUID value (provider-specific strategy)
    private UUID id; // Unique identifier for the expense

    private String title; // Short title/description of the expense

    @Column(precision = 19, scale = 4) // JPA: control decimal precision/scale for amount column
    private BigDecimal amount; // Monetary amount of the expense

    private String category; // Category label for grouping (e.g., Food, Travel)

    @Column(nullable = false) // JPA: date must be present
    private Instant date; // When the expense occurred

    @Column(length = 2048) // JPA: allow notes up to 2048 characters
    private String notes; // Optional notes or details

    @ManyToOne(optional = false, fetch = FetchType.LAZY) // JPA: many expenses belong to one user; must be set; load lazily
    @JoinColumn(name = "user_id", nullable = false) // JPA: foreign key column linking to users table
    private User user; // Owning user of the expense
}
