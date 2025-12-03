package com.expensetracker.backend.config; // Package: application configuration and setup components

import com.expensetracker.backend.model.Expense; // Expense entity used for seeding sample data
import com.expensetracker.backend.model.Preference; // Preference entity for default user settings
import com.expensetracker.backend.model.User; // User entity for demo account
import com.expensetracker.backend.repository.ExpenseRepository; // Repository to persist Expense
import com.expensetracker.backend.repository.PreferenceRepository; // Repository to persist Preference
import com.expensetracker.backend.repository.UserRepository; // Repository to persist and query User
import org.springframework.boot.CommandLineRunner; // Interface to run code after application startup
import org.springframework.stereotype.Component; // Marks class as Spring component
import org.springframework.transaction.annotation.Transactional; // Ensures operations run within a transaction
import org.springframework.security.crypto.password.PasswordEncoder; // Password hashing utility

import java.math.BigDecimal; // Precise decimal type for money values
import java.time.Instant; // Timestamp for createdAt and dates

@Component // Register this seeder as a Spring bean
public class SeedRunner implements CommandLineRunner { // Runs once on application startup to seed demo data

    private final UserRepository users; // Dependency: user data access
    private final PreferenceRepository prefs; // Dependency: preference data access
    private final ExpenseRepository expenses; // Dependency: expense data access
    private final PasswordEncoder encoder; // Dependency: password encoder for hashing demo password

    public SeedRunner(UserRepository users, PreferenceRepository prefs, ExpenseRepository expenses, PasswordEncoder encoder) { // Constructor injection
        this.users = users; // Assign repository
        this.prefs = prefs; // Assign repository
        this.expenses = expenses; // Assign repository
        this.encoder = encoder; // Assign encoder
    }

    @Override // Implement CommandLineRunner's run method
    @Transactional // Execute seeding within a single transaction for consistency
    public void run(String... args) { // Method called after application context starts
        String email = "demo@example.com"; // Demo user email identifier
        if (users.findByEmail(email).isEmpty()) { // Only seed if demo user doesn't exist
            User user = User.builder() // Build new user using Lombok builder
                    .email(email) // Set email
                    .password(encoder.encode("DemoPass123")) // Hash and set demo password
                    .createdAt(Instant.now()) // Record creation timestamp
                    .build(); // Complete builder construction
            user = users.save(user); // Persist user and retrieve saved instance

            Preference pref = Preference.builder() // Build default preferences
                    .user(user) // Associate preferences with user (MapsId)
                    .currency("USD") // Set default currency
                    .theme("neon") // Set default theme
                    .build(); // Finish building
            prefs.save(pref); // Persist preferences

            expenses.save(Expense.builder() // Save sample expense: Coffee
                    .title("Coffee") // Title
                    .amount(new BigDecimal("3.50")) // Amount
                    .category("Food") // Category
                    .date(Instant.now()) // Date
                    .notes("Latte") // Notes
                    .user(user) // Link to user
                    .build()); // Finish building

            expenses.save(Expense.builder() // Save sample expense: Groceries
                    .title("Groceries") // Title
                    .amount(new BigDecimal("25.00")) // Amount
                    .category("Food") // Category
                    .date(Instant.now()) // Date
                    .notes("Milk and bread") // Notes
                    .user(user) // Link to user
                    .build()); // Finish building
        }
    }
}
