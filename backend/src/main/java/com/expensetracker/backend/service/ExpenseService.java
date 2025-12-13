package com.expensetracker.backend.service; // Package: business logic services

import com.expensetracker.backend.dto.ExpenseDtos.ExpenseRequest; // Import DTO for create/update expense requests
import com.expensetracker.backend.dto.ExpenseDtos.ExpenseResponse; // Import DTO for expense responses to clients
import com.expensetracker.backend.exception.EntityNotFoundException; // Custom exception for not-found entities
import com.expensetracker.backend.model.Expense; // Expense entity
import com.expensetracker.backend.model.User; // User entity
import com.expensetracker.backend.repository.ExpenseRepository; // Repository for persisting Expense
import com.expensetracker.backend.repository.UserRepository; // Repository for accessing User
import org.springframework.stereotype.Service; // Stereotype annotation marking service component

import java.math.BigDecimal; // BigDecimal for monetary validations
import java.util.List; // List collection for returning multiple DTOs
import java.util.UUID; // UUID type for expense identifier

@Service // Spring: register as a service bean for dependency injection
public class ExpenseService { // Service encapsulating expense-related business operations

    private final ExpenseRepository expenseRepository; // Dependency: data access for expenses
    private final UserRepository userRepository; // Dependency: data access for users

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) { // Constructor injection of dependencies
        this.expenseRepository = expenseRepository; // Assign repository dependency
        this.userRepository = userRepository; // Assign repository dependency
    }

    private User demoUser() { // Helper: fetch seeded demo user (auth disabled)
        return userRepository.findByEmail("demo@example.com") // Query user by email
                .orElseThrow(() -> new EntityNotFoundException("Demo user not seeded")); // Throw if missing
    }

    public List<ExpenseResponse> listCurrentUser() { // List expenses for current (demo) user
        User user = demoUser(); // Get demo user
        return expenseRepository.findByUserId(user.getId()).stream().map(this::toResponse).toList(); // Fetch, map to DTOs, return
    }

    public ExpenseResponse add(ExpenseRequest request) { // Create a new expense
        validateExpenseRequest(request); // Validate request fields
        User user = demoUser(); // Get demo user
        Expense e = new Expense(); // Instantiate entity
        e.setTitle(request.title()); // Set title from request
        e.setAmount(request.amount()); // Set amount from request
        e.setCategory(request.category()); // Set category from request
        e.setDate(request.date()); // Set date from request
        e.setNotes(request.notes()); // Set notes from request
        e.setUser(user); // Associate with demo user
        e = expenseRepository.save(e); // Persist and get saved entity
        return toResponse(e); // Convert to response DTO
    }

    public ExpenseResponse update(UUID id, ExpenseRequest request) { // Update an existing expense by id
        validateExpenseRequest(request); // Validate request fields
        User user = demoUser(); // Get demo user
        Expense e = expenseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Expense not found")); // Load entity or error
        if (!e.getUser().getId().equals(user.getId())) { // Ensure expense belongs to current demo user
            throw new IllegalArgumentException("Cannot modify another user's expense in demo mode"); // Reject cross-user modification
        }
        e.setTitle(request.title()); // Update title
        e.setAmount(request.amount()); // Update amount
        e.setCategory(request.category()); // Update category
        e.setDate(request.date()); // Update date
        e.setNotes(request.notes()); // Update notes
        e = expenseRepository.save(e); // Save changes
        return toResponse(e); // Return updated DTO
    }

    public void delete(UUID id) { // Delete an expense by id
        User user = demoUser(); // Get demo user
        Expense e = expenseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Expense not found")); // Load entity or error
        if (!e.getUser().getId().equals(user.getId())) { // Validate ownership
            throw new IllegalArgumentException("Cannot delete another user's expense in demo mode"); // Reject deletion if not owner
        }
        expenseRepository.delete(e); // Remove entity from repository
    }

    private void validateExpenseRequest(ExpenseRequest request) { // Validate incoming expense request data
        if (request.title() == null || request.title().isBlank()) throw new IllegalArgumentException("Title is required"); // Title must be non-empty
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Amount must be positive"); // Positive amount required
        if (request.category() == null || request.category().isBlank()) throw new IllegalArgumentException("Category is required"); // Category must be non-empty
        if (request.date() == null) throw new IllegalArgumentException("Date is required"); // Date must be provided
    }

    private ExpenseResponse toResponse(Expense e) { // Map entity to response DTO
        return new ExpenseResponse(e.getId(), e.getTitle(), e.getAmount(), e.getCategory(), e.getDate(), e.getNotes()); // Construct DTO from entity fields
    }
}
