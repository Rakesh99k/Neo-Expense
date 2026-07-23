package com.expensetracker.backend.model; // Package declaration: places this class in the com.expensetracker.backend.model namespace

import jakarta.persistence.*; // Imports JPA annotations for ORM mapping (Entity, Id, Column, etc.)
import lombok.AllArgsConstructor; // Lombok annotation: generates an all-args constructor
import lombok.Builder; // Lombok annotation: enables the builder pattern for this class
import lombok.Data; // Lombok annotation: generates getters, setters, equals, hashCode, and toString
import lombok.NoArgsConstructor; // Lombok annotation: generates a no-args constructor

import java.time.Instant; // Imports Instant type to store a timestamp (createdAt)

@Data // Lombok: auto-generates boilerplate methods (getters/setters/etc.)
@Builder // Lombok: enables building instances via User.builder()...
@NoArgsConstructor // Lombok: provides a constructor with no parameters
@AllArgsConstructor // Lombok: provides a constructor with all fields as parameters
@Entity // JPA: marks this class as a persistent entity mapped to a database table
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = {"email"})}) // JPA: maps entity to table "users" and enforces unique constraint on the email column
public class User { // Class definition for the User entity
    @Id // JPA: marks the primary key field
    @GeneratedValue(strategy = GenerationType.IDENTITY) // JPA: database auto-generates ID (typically auto-increment)
    private Long id; // Primary key: unique identifier for the user

    @Column(nullable = false, unique = true) // JPA: email must be present and unique in the table
    private String email; // User's email address (also used for login/identity)

    @Column(nullable = false) // JPA: password must be present (not null)
    private String password; // Hashed password string for authentication (should not store plain text)

    @Column(nullable = false) // JPA: createdAt must be present (not null)
    private Instant createdAt; // Timestamp when the user record was created
}
