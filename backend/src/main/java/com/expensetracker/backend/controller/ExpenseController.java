package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.ExpenseDtos.ExpenseRequest;
import com.expensetracker.backend.dto.ExpenseDtos.ExpenseResponse;
import com.expensetracker.backend.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> list() {
        return ResponseEntity.ok(expenseService.listCurrentUser());
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> add(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@PathVariable UUID id, @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) throws java.nio.file.AccessDeniedException {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

