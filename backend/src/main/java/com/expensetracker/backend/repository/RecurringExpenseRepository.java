package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.RecurringExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface RecurringExpenseRepository extends JpaRepository<RecurringExpense, UUID> {

    @Query("SELECT r FROM RecurringExpense r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<RecurringExpense> findAllByUserId(Long userId);

    @Query("SELECT r FROM RecurringExpense r WHERE r.active = true AND r.nextDueAt <= :now")
    List<RecurringExpense> findDueForGeneration(Instant now);
}