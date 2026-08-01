package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.LendingPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LendingPaymentRepository extends JpaRepository<LendingPayment, UUID> {
}