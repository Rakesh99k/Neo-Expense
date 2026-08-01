package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.LendingDtos.*;
import com.expensetracker.backend.service.LendingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lending")
public class LendingController {

    private final LendingService lendingService;

    public LendingController(LendingService lendingService) {
        this.lendingService = lendingService;
    }

    @GetMapping
    public ResponseEntity<List<LendingResponse>> list() {
        return ResponseEntity.ok(lendingService.list());
    }

    @GetMapping("/summary")
    public ResponseEntity<LendingSummaryResponse> summary() {
        return ResponseEntity.ok(lendingService.summary());
    }

    @PostMapping
    public ResponseEntity<LendingResponse> add(@Valid @RequestBody LendingRequest request) {
        return ResponseEntity.ok(lendingService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LendingResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody LendingRequest request
    ) {
        return ResponseEntity.ok(lendingService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        lendingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<LendingResponse> recordPayment(
            @PathVariable UUID id,
            @Valid @RequestBody PaymentRequest request
    ) {
        return ResponseEntity.ok(lendingService.recordPayment(id, request));
    }
}