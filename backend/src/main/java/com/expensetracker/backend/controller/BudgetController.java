package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.BudgetDtos.BudgetResponse;
import com.expensetracker.backend.dto.BudgetDtos.BudgetUpdateRequest;
import com.expensetracker.backend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<BudgetResponse> get() {
        return ResponseEntity.ok(budgetService.get());
    }

    @PutMapping
    public ResponseEntity<BudgetResponse> update(@Valid @RequestBody BudgetUpdateRequest request) {
        return ResponseEntity.ok(budgetService.update(request));
    }
}