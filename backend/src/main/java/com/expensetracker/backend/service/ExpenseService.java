package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.ExpenseDtos.ExpenseRequest;
import com.expensetracker.backend.dto.ExpenseDtos.ExpenseResponse;
import com.expensetracker.backend.exception.EntityNotFoundException;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private User demoUser() {
        return userRepository.findByEmail("demo@example.com")
                .orElseThrow(() -> new EntityNotFoundException("Demo user not seeded"));
    }

    public List<ExpenseResponse> listCurrentUser() {
        User user = demoUser();
        return expenseRepository.findByUserId(user.getId()).stream().map(this::toResponse).toList();
    }

    public ExpenseResponse add(ExpenseRequest request) {
        validateExpenseRequest(request);
        User user = demoUser();
        Expense e = new Expense();
        e.setTitle(request.title());
        e.setAmount(request.amount());
        e.setCategory(request.category());
        e.setDate(request.date());
        e.setNotes(request.notes());
        e.setUser(user);
        e = expenseRepository.save(e);
        return toResponse(e);
    }

    public ExpenseResponse update(UUID id, ExpenseRequest request) {
        validateExpenseRequest(request);
        User user = demoUser();
        Expense e = expenseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Expense not found"));
        if (!e.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cannot modify another user's expense in demo mode");
        }
        e.setTitle(request.title());
        e.setAmount(request.amount());
        e.setCategory(request.category());
        e.setDate(request.date());
        e.setNotes(request.notes());
        e = expenseRepository.save(e);
        return toResponse(e);
    }

    public void delete(UUID id) {
        User user = demoUser();
        Expense e = expenseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Expense not found"));
        if (!e.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cannot delete another user's expense in demo mode");
        }
        expenseRepository.delete(e);
    }

    private void validateExpenseRequest(ExpenseRequest request) {
        if (request.title() == null || request.title().isBlank()) throw new IllegalArgumentException("Title is required");
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Amount must be positive");
        if (request.category() == null || request.category().isBlank()) throw new IllegalArgumentException("Category is required");
        if (request.date() == null) throw new IllegalArgumentException("Date is required");
    }

    private ExpenseResponse toResponse(Expense e) {
        return new ExpenseResponse(e.getId(), e.getTitle(), e.getAmount(), e.getCategory(), e.getDate(), e.getNotes());
    }
}
