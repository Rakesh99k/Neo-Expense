package com.expensetracker.backend.dto; // Package: DTO classes

import jakarta.validation.constraints.NotBlank; // Validation: ensure strings are not blank

public class PreferenceDtos { // Container class for preference-related records
    public record PreferenceRequest(@NotBlank String currency, @NotBlank String theme) {} // Request: currency and theme must be non-blank
    public record PreferenceResponse(String currency, String theme) {} // Response: current currency and theme
}
