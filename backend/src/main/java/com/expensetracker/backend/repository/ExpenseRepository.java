package com.expensetracker.backend.repository; // Package for data access repositories

import com.expensetracker.backend.model.Expense; // Import Expense entity managed by this repository
import org.springframework.data.jpa.repository.JpaRepository; // Base JPA repository providing CRUD and pagination
import org.springframework.data.jpa.repository.Query; // Annotation to define custom JPQL queries

import java.util.List; // List type for returning multiple results
import java.util.UUID; // UUID as primary key type for Expense

public interface ExpenseRepository extends JpaRepository<Expense, UUID> { // Repository interface for Expense with UUID id
    @Query("select e from Expense e where e.user.id = :userId order by e.date desc") // JPQL query: fetch expenses for a user, newest first
    List<Expense> findByUserId(Long userId); // Method signature binds :userId and returns list of expenses
}
