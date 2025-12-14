package com.expensetracker.backend.repository; // Package: repository interfaces for data persistence

import com.expensetracker.backend.model.Preference; // Import Preference entity managed by this repository
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA base repository

import java.util.Optional; // Optional type for possibly absent values

public interface PreferenceRepository extends JpaRepository<Preference, Long> { // Repository for Preference with primary key Long
    Optional<Preference> findByUserId(Long userId); // Derived query: lookup preferences by associated user's id
}
