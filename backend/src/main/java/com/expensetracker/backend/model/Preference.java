package com.expensetracker.backend.model; // Package declaration: groups classes under backend.model

import jakarta.persistence.*; // JPA annotations for ORM mapping
import lombok.AllArgsConstructor; // Lombok: generate all-args constructor
import lombok.Builder; // Lombok: enable builder pattern
import lombok.Data; // Lombok: generate getters, setters, equals, hashCode, toString
import lombok.NoArgsConstructor; // Lombok: generate no-args constructor

@Data // Lombok: auto-generate boilerplate methods
@Builder // Lombok: allow fluent object construction
@NoArgsConstructor // Lombok: create a no-args constructor
@AllArgsConstructor // Lombok: create an all-args constructor
@Entity // JPA: mark as a database entity
@Table(name = "preferences") // JPA: map entity to the "preferences" table
public class Preference { // Class representing per-user preferences
    @Id // JPA: primary key of this entity
    private Long id; // same as user id for one-to-one mapping

    @OneToOne(optional = false) // JPA: one preference record per one user; must exist
    @MapsId // JPA: share the same primary key value as the associated user
    @JoinColumn(name = "user_id") // JPA: foreign key column name in preferences table
    private User user; // Associated user for whom preferences are stored

    @Column(nullable = false) // JPA: currency cannot be null
    private String currency = "USD"; // Preferred currency code with default "USD"

    @Column(nullable = false) // JPA: theme cannot be null
    private String theme = "neon"; // Preferred UI theme with default "neon"
}
