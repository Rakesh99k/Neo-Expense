package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.SavingsDtos.SavingsResponse;
import com.expensetracker.backend.service.SavingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/savings")
public class SavingsController {

    private final SavingsService savingsService;

    public SavingsController(SavingsService savingsService) {
        this.savingsService = savingsService;
    }

    @GetMapping
    public ResponseEntity<SavingsResponse> get() {
        return ResponseEntity.ok(savingsService.get());
    }
}