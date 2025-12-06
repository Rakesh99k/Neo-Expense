package com.expensetracker.backend.dto; // Package: authentication-related DTOs

import jakarta.validation.constraints.Email; // Validation: enforce email format
import jakarta.validation.constraints.NotBlank; // Validation: ensure value is not blank
import jakarta.validation.constraints.Size; // Validation: enforce string length constraints

public class AuthDtos { // Container for auth request/response records
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {} // Login payload: valid email and non-blank password
    public record RegisterRequest(@Email @NotBlank String email, @Size(min = 8) String password) {} // Register payload: valid email and min-length password
    public record AuthResponse(String token, String email) {} // Response: JWT token and associated email
}
