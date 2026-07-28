package com.expensetracker.backend.config;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.Preference;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.PreferenceRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

// Only runs in dev profile — NEVER in production
@Profile("dev")
@Component
public class SeedRunner implements CommandLineRunner {

    private final UserRepository users;
    private final PreferenceRepository prefs;
    private final ExpenseRepository expenses;
    private final PasswordEncoder encoder;

    public SeedRunner(
            UserRepository users,
            PreferenceRepository prefs,
            ExpenseRepository expenses,
            PasswordEncoder encoder
    ) {
        this.users = users;
        this.prefs = prefs;
        this.expenses = expenses;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String email = "demo@example.com";

        if (users.findByEmail(email).isEmpty()) {
            User user = User.builder()
                    .email(email)
                    .password(encoder.encode("DemoPass123"))
                    .createdAt(Instant.now())
                    .build();
            user = users.save(user);

            Preference pref = Preference.builder()
                    .user(user)
                    .currency("INR")
                    .theme("neon-noir")
                    .build();
            prefs.save(pref);

            expenses.save(Expense.builder()
                    .title("Coffee")
                    .amount(new BigDecimal("80.00"))
                    .category("Food")
                    .date(Instant.now())
                    .notes("Morning filter coffee")
                    .user(user)
                    .build());

            expenses.save(Expense.builder()
                    .title("Groceries")
                    .amount(new BigDecimal("1250.00"))
                    .category("Food")
                    .date(Instant.now())
                    .notes("Weekly groceries")
                    .user(user)
                    .build());

            System.out.println("[SeedRunner] Demo user created: " + email);
        }
    }
}