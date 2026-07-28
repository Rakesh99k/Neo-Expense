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
            @Email @NotBlank String email,

            // At least 8 chars, one uppercase, one digit
            @Size(min = 8, message = "Password must be at least 8 characters")
            @Pattern(
                    regexp = "^(?=.*[A-Z])(?=.*\\d).+$",
                    message = "Password must contain at least one uppercase letter and one number"
            )
            String password
    ) {}

    public record AuthResponse(
            String token,
            String email
    ) {}
}