package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.PreferenceDtos.PreferenceRequest;
import com.expensetracker.backend.dto.PreferenceDtos.PreferenceResponse;
import com.expensetracker.backend.model.Preference;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.PreferenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Set;

@Service
public class PreferenceService {

    private static final Set<String> ALLOWED_CURRENCIES =
            Set.of("USD", "EUR", "INR", "GBP");

    private static final Set<String> ALLOWED_THEMES =
            Set.of("neon-noir", "western-comic", "manga", "cartoon-flat", "graphic-novel");

    private final PreferenceRepository preferenceRepository;
    private final CurrentUserService currentUserService;

    public PreferenceService(
            PreferenceRepository preferenceRepository,
            CurrentUserService currentUserService
    ) {
        this.preferenceRepository = preferenceRepository;
        this.currentUserService = currentUserService;
    }

    /**
     * Loads the authenticated user's preferences.
     * Creates INR/neon defaults if preferences do not exist yet.
     */
    @Transactional
    public PreferenceResponse get() {
        User user = currentUserService.getCurrentUser();

        Preference preference = preferenceRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Preference created = Preference.builder()
                            .user(user)
                            .currency("INR")
                            .theme("neon-noir")
                            .build();

                    return preferenceRepository.save(created);
                });

        return toResponse(preference);
    }

    /**
     * Updates the authenticated user's preferences.
     *
     * @Transactional is important here. It keeps the loaded Preference
     * managed while fields are changed, allowing Hibernate dirty checking
     * to perform the UPDATE safely.
     */
    @Transactional
    public PreferenceResponse update(PreferenceRequest request) {
        String currency = normalizeCurrency(request.currency());
        String theme = normalizeTheme(request.theme());

        if (!ALLOWED_CURRENCIES.contains(currency)) {
            throw new IllegalArgumentException("Invalid currency");
        }

        if (!ALLOWED_THEMES.contains(theme)) {
            throw new IllegalArgumentException("Invalid theme");
        }

        User user = currentUserService.getCurrentUser();

        Preference preference = preferenceRepository.findByUserId(user.getId())
                .orElse(null);

        if (preference == null) {
            preference = Preference.builder()
                    .user(user)
                    .currency(currency)
                    .theme(theme)
                    .build();

            preference = preferenceRepository.save(preference);
        } else {
            // The entity is managed inside this transaction.
            // Hibernate will update it when the transaction commits.
            preference.setCurrency(currency);
            preference.setTheme(theme);
        }

        // Force SQL execution here so database errors happen inside this method.
        preferenceRepository.flush();

        return toResponse(preference);
    }

    private String normalizeCurrency(String currency) {
        if (currency == null) {
            throw new IllegalArgumentException("Currency is required");
        }

        return currency.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeTheme(String theme) {
        if (theme == null) {
            throw new IllegalArgumentException("Theme is required");
        }

        return theme.trim().toLowerCase(Locale.ROOT);
    }

    private PreferenceResponse toResponse(Preference preference) {
        return new PreferenceResponse(
                preference.getCurrency(),
                preference.getTheme()
        );
    }
}