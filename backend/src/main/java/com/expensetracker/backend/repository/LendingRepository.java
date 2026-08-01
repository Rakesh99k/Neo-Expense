package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Lending;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface LendingRepository extends JpaRepository<Lending, UUID> {

    @Query("SELECT l FROM Lending l WHERE l.user.id = :userId ORDER BY l.date DESC")
    List<Lending> findAllByUserId(Long userId);

    @Query("SELECT DISTINCT l.personName FROM Lending l WHERE l.user.id = :userId ORDER BY l.personName")
    List<String> findDistinctPersonNamesByUserId(Long userId);
}