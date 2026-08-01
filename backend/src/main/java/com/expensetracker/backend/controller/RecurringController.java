package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.RecurringDtos.RecurringRequest;
import com.expensetracker.backend.dto.RecurringDtos.RecurringResponse;
import com.expensetracker.backend.service.RecurringScheduler;
import com.expensetracker.backend.service.RecurringService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recurring")
public class RecurringController {

    private final RecurringService recurringService;
    private final RecurringScheduler recurringScheduler;

    public RecurringController(
            RecurringService recurringService,
            RecurringScheduler recurringScheduler
    ) {
        this.recurringService = recurringService;
        this.recurringScheduler = recurringScheduler;
    }

    @GetMapping
    public ResponseEntity<List<RecurringResponse>> list() {
        return ResponseEntity.ok(recurringService.list());
    }

    @PostMapping
    public ResponseEntity<RecurringResponse> add(@Valid @RequestBody RecurringRequest request) {
        return ResponseEntity.ok(recurringService.add(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody RecurringRequest request
    ) {
        return ResponseEntity.ok(recurringService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        recurringService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<RecurringResponse> pause(@PathVariable UUID id) {
        return ResponseEntity.ok(recurringService.setActive(id, false));
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<RecurringResponse> resume(@PathVariable UUID id) {
        return ResponseEntity.ok(recurringService.setActive(id, true));
    }

    /**
     * Manually create an expense from this recurring template right now.
     * Useful if user doesn't want to wait for scheduled run.
     */
    @PostMapping("/{id}/generate-now")
    public ResponseEntity<Void> generateNow(@PathVariable UUID id) {
        recurringScheduler.generateNow(id);
        return ResponseEntity.noContent().build();
    }
}