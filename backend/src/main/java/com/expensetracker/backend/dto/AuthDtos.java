package com.expensetracker.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    public record RegisterRequest(
            @NotBlank(message = "First name is required")
            @Size(min = 1, max = 100, message = "First name must be 1-100 characters")
            String firstName,

            @Size(max = 100, message = "Last name must be under 100 characters")
            String lastName,

            @Email(message = "Invalid email format")
            @NotBlank(message = "Email is required")
            String email,

            @Size(min = 8, message = "Password must be at least 8 characters")
            @Pattern(
                    regexp = "^(?=.*[A-Z])(?=.*\\d).+$",
                    message = "Password must contain at least one uppercase letter and one number"
            )
            String password
    ) {}

    // Response after login OR register (register still returns token
    // but frontend chooses to ignore it and redirect to login)
    public record AuthResponse(
            String token,
            String email,
            String firstName,
            String lastName
    ) {}

    // For GET /api/auth/me — current user info
    public record MeResponse(
            String email,
            String firstName,
            String lastName
    ) {}
}