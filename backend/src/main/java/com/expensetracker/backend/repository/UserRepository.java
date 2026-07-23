package com.expensetracker.backend.repository; // Package: repository layer for data access interfaces

import com.expensetracker.backend.model.User; // Import the User entity managed by this repository
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA base repository providing CRUD operations

import java.util.Optional; // Optional wrapper for nullable results

public interface UserRepository extends JpaRepository<User, Long> { // Interface: JPA repository for User with primary key type Long
    Optional<User> findByEmail(String email); // Derived query method: finds a user by email, returns Optional
}
