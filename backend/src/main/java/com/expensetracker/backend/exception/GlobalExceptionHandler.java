package com.expensetracker.backend.exception; // Package: global error handling components

import jakarta.servlet.http.HttpServletRequest; // Provides access to request details
import org.springframework.http.HttpStatus; // HTTP status codes enumeration
import org.springframework.http.ResponseEntity; // HTTP response wrapper for status and body
import org.springframework.web.bind.MethodArgumentNotValidException; // Exception for validation failures on method arguments
import org.springframework.web.bind.annotation.ControllerAdvice; // Marks class as global controller advisor
import org.springframework.web.bind.annotation.ExceptionHandler; // Annotation to register exception handling methods

import java.nio.file.AccessDeniedException; // Exception indicating access denial (used for consistency)
import java.time.Instant; // Timestamp for error responses
import java.util.Map; // Map container for JSON response bodies

@ControllerAdvice // Enable global exception handling across controllers
public class GlobalExceptionHandler { // Centralized mapping from exceptions to HTTP responses

    @ExceptionHandler(MethodArgumentNotValidException.class) // Handle validation errors from @Valid
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) { // Build 400 response body
        String msg = ex.getBindingResult().getFieldErrors().stream() // Extract field errors stream
                .map(f -> f.getField() + ": " + f.getDefaultMessage()) // Map to "field: message"
                .findFirst().orElse("Validation error"); // Use first message or default
        return build(HttpStatus.BAD_REQUEST, msg, req.getRequestURI()); // Return 400 with message and path
    }

    @ExceptionHandler(AccessDeniedException.class) // Handle access denied cases
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) { // Build 403 response
        return build(HttpStatus.FORBIDDEN, "Access denied", req.getRequestURI()); // 403 Forbidden
    }

    @ExceptionHandler(EntityNotFoundException.class) // Handle custom not-found exceptions
    public ResponseEntity<Map<String, Object>> handleNotFound(EntityNotFoundException ex, HttpServletRequest req) { // Build 404 response
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI()); // 404 Not Found with message
    }

    @ExceptionHandler(IllegalArgumentException.class) // Handle invalid argument cases
    public ResponseEntity<Map<String, Object>> handleIllegalArg(IllegalArgumentException ex, HttpServletRequest req) { // Build 400 response
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI()); // 400 Bad Request
    }

    @ExceptionHandler(Exception.class) // Fallback: handle any uncaught exceptions
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex, HttpServletRequest req) { // Build 500 response
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", req.getRequestURI()); // 500 Internal Server Error
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message, String path) { // Helper: create standardized response body
        return ResponseEntity.status(status).body(Map.of( // Build ResponseEntity with status and immutable map
                "message", message, // Error message
                "timestamp", Instant.now().toString(), // Time of the error occurrence
                "path", path // Requested URI path
        ));
    }
}
