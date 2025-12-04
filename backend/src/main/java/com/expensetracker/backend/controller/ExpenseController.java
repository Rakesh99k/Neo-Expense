package com.expensetracker.backend.controller; // Package: REST controllers for HTTP endpoints

import com.expensetracker.backend.dto.ExpenseDtos.ExpenseRequest; // DTO type for incoming expense payloads
import com.expensetracker.backend.dto.ExpenseDtos.ExpenseResponse; // DTO type for outgoing expense payloads
import com.expensetracker.backend.service.ExpenseService; // Service handling expense business logic
import jakarta.validation.Valid; // Bean Validation annotation for request validation
import org.springframework.http.ResponseEntity; // Response wrapper with status and body
import org.springframework.web.bind.annotation.*; // Spring MVC annotations for REST mapping

import java.util.List; // List type for collections
import java.util.UUID; // UUID type for path variable id

@RestController // Marks this class as a REST controller (JSON responses)
@RequestMapping("/api/expenses") // Base path for all expense endpoints
public class ExpenseController { // Controller exposing expense-related endpoints

    private final ExpenseService expenseService; // Dependency on service layer

    public ExpenseController(ExpenseService expenseService) { // Constructor injection for service dependency
        this.expenseService = expenseService; // Assign service field
    }

    @GetMapping // HTTP GET at base path: list expenses
    public ResponseEntity<List<ExpenseResponse>> list() { // Response entity containing list of expense responses
        return ResponseEntity.ok(expenseService.listCurrentUser()); // 200 OK with body from service
    }

    @PostMapping // HTTP POST at base path: add expense
    public ResponseEntity<ExpenseResponse> add(@Valid @RequestBody ExpenseRequest request) { // Validate and bind request body to DTO
        return ResponseEntity.ok(expenseService.add(request)); // 200 OK with created expense
    }

    @PutMapping("/{id}") // HTTP PUT at /{id}: update specific expense
    public ResponseEntity<ExpenseResponse> update(@PathVariable UUID id, @Valid @RequestBody ExpenseRequest request) { // Bind path id and validate body
        return ResponseEntity.ok(expenseService.update(id, request)); // 200 OK with updated expense
    }

    @DeleteMapping("/{id}") // HTTP DELETE at /{id}: delete specific expense
    public ResponseEntity<Void> delete(@PathVariable UUID id) throws java.nio.file.AccessDeniedException { // Bind path id; declared exception for compatibility
        expenseService.delete(id); // Invoke deletion in service
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
