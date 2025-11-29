package com.expensetracker.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class PreferenceDtos {
    public record PreferenceRequest(@NotBlank String currency, @NotBlank String theme) {}
    public record PreferenceResponse(String currency, String theme) {}
}

