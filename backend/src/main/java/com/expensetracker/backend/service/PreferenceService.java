package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.PreferenceDtos.PreferenceRequest;
import com.expensetracker.backend.dto.PreferenceDtos.PreferenceResponse;
import com.expensetracker.backend.model.Preference;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.PreferenceRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class PreferenceService {

    private final PreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    private static final Set<String> ALLOWED_CURRENCIES = Set.of("USD","EUR","INR","GBP");
    private static final Set<String> ALLOWED_THEMES = Set.of("neon","light");

    public PreferenceService(PreferenceRepository preferenceRepository, UserRepository userRepository) {
        this.preferenceRepository = preferenceRepository;
        this.userRepository = userRepository;
    }

    private User demoUser() {
        return userRepository.findByEmail("demo@example.com").orElseThrow();
    }

    public PreferenceResponse get() {
        User user = demoUser();
        Preference pref = preferenceRepository.findByUserId(user.getId())
                .orElseGet(() -> preferenceRepository.save(Preference.builder().user(user).currency("USD").theme("neon").build()));
        return new PreferenceResponse(pref.getCurrency(), pref.getTheme());
    }

    public PreferenceResponse update(PreferenceRequest request) {
        if (!ALLOWED_CURRENCIES.contains(request.currency())) throw new IllegalArgumentException("Invalid currency");
        if (!ALLOWED_THEMES.contains(request.theme())) throw new IllegalArgumentException("Invalid theme");
        User user = demoUser();
        Preference pref = preferenceRepository.findByUserId(user.getId())
                .orElseGet(() -> Preference.builder().user(user).build());
        pref.setCurrency(request.currency());
        pref.setTheme(request.theme());
        pref = preferenceRepository.save(pref);
        return new PreferenceResponse(pref.getCurrency(), pref.getTheme());
    }
}
