package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.MonthlySnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MonthlySnapshotRepository extends JpaRepository<MonthlySnapshot, UUID> {

    Optional<MonthlySnapshot> findByUserIdAndYearAndMonth(Long userId, Integer year, Integer month);

    @Query("SELECT s FROM MonthlySnapshot s WHERE s.user.id = :userId ORDER BY s.year DESC, s.month DESC")
    List<MonthlySnapshot> findAllByUserIdOrderByDateDesc(Long userId);
}