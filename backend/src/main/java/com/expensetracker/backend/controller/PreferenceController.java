package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.PreferenceDtos.PreferenceRequest;
import com.expensetracker.backend.dto.PreferenceDtos.PreferenceResponse;
import com.expensetracker.backend.service.PreferenceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prefs")
public class PreferenceController {

    private final PreferenceService preferenceService;

    public PreferenceController(PreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping
    public ResponseEntity<PreferenceResponse> get() {
        return ResponseEntity.ok(preferenceService.get());
    }

    @PutMapping
    public ResponseEntity<PreferenceResponse> update(@Valid @RequestBody PreferenceRequest request) {
        return ResponseEntity.ok(preferenceService.update(request));
    }
}

