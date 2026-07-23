package com.expensetracker.backend.controller; // Package: REST controllers

import com.expensetracker.backend.dto.PreferenceDtos.PreferenceRequest; // DTO for incoming preference changes
import com.expensetracker.backend.dto.PreferenceDtos.PreferenceResponse; // DTO for outgoing preference data
import com.expensetracker.backend.service.PreferenceService; // Service encapsulating preference logic
import jakarta.validation.Valid; // Validation annotation to enforce constraints on request body
import org.springframework.http.ResponseEntity; // Generic HTTP response wrapper
import org.springframework.web.bind.annotation.*; // Spring Web annotations for REST

@RestController // Mark as REST controller producing JSON
@RequestMapping("/api/prefs") // Base path for preferences endpoints
public class PreferenceController { // Controller serving preference operations

    private final PreferenceService preferenceService; // Service dependency

    public PreferenceController(PreferenceService preferenceService) { // Constructor injection
        this.preferenceService = preferenceService; // Assign dependency
    }

    @GetMapping // HTTP GET to retrieve preferences
    public ResponseEntity<PreferenceResponse> get() { // Return preferences as response entity
        return ResponseEntity.ok(preferenceService.get()); // 200 OK with current preferences
    }

    @PutMapping // HTTP PUT to update preferences
    public ResponseEntity<PreferenceResponse> update(@Valid @RequestBody PreferenceRequest request) { // Validate request body and bind to DTO
        return ResponseEntity.ok(preferenceService.update(request)); // 200 OK with updated preferences
    }
}
