package com.expensetracker.backend.service; // Package: service layer containing business logic

import com.expensetracker.backend.dto.PreferenceDtos.PreferenceRequest; // DTO for incoming preference update requests
import com.expensetracker.backend.dto.PreferenceDtos.PreferenceResponse; // DTO for outgoing preference data
import com.expensetracker.backend.model.Preference; // Preference entity
import com.expensetracker.backend.model.User; // User entity
import com.expensetracker.backend.repository.PreferenceRepository; // Repository for Preference persistence
import com.expensetracker.backend.repository.UserRepository; // Repository for User access
import org.springframework.stereotype.Service; // Spring service stereotype

import java.util.Set; // Set collection for allowed values

@Service // Register as a Spring-managed service component
public class PreferenceService { // Business logic for user preferences

    private final PreferenceRepository preferenceRepository; // Dependency: data access for preferences
    private final UserRepository userRepository; // Dependency: data access for users

    private static final Set<String> ALLOWED_CURRENCIES = Set.of("USD","EUR","INR","GBP"); // Allowed currency codes
    private static final Set<String> ALLOWED_THEMES = Set.of("neon","light"); // Allowed theme identifiers

    public PreferenceService(PreferenceRepository preferenceRepository, UserRepository userRepository) { // Constructor injection
        this.preferenceRepository = preferenceRepository; // Assign dependency
        this.userRepository = userRepository; // Assign dependency
    }

    private User demoUser() { // Helper: return seeded demo user (auth disabled)
        return userRepository.findByEmail("demo@example.com").orElseThrow(); // Find or throw if missing
    }

    public PreferenceResponse get() { // Fetch current user's preferences
        User user = demoUser(); // Identify current (demo) user
        Preference pref = preferenceRepository.findByUserId(user.getId()) // Try load existing preferences
                .orElseGet(() -> preferenceRepository.save(Preference.builder().user(user).currency("USD").theme("neon").build())); // Create defaults if absent
        return new PreferenceResponse(pref.getCurrency(), pref.getTheme()); // Map to response DTO
    }

    public PreferenceResponse update(PreferenceRequest request) { // Update preferences with validation
        if (!ALLOWED_CURRENCIES.contains(request.currency())) throw new IllegalArgumentException("Invalid currency"); // Validate currency
        if (!ALLOWED_THEMES.contains(request.theme())) throw new IllegalArgumentException("Invalid theme"); // Validate theme
        User user = demoUser(); // Identify user
        Preference pref = preferenceRepository.findByUserId(user.getId()) // Load existing or create new
                .orElseGet(() -> Preference.builder().user(user).build()); // Initialize when missing
        pref.setCurrency(request.currency()); // Apply currency change
        pref.setTheme(request.theme()); // Apply theme change
        pref = preferenceRepository.save(pref); // Persist changes
        return new PreferenceResponse(pref.getCurrency(), pref.getTheme()); // Return DTO
    }
}
