package com.expensetracker.backend.security; // Package: security services

import com.expensetracker.backend.model.User; // Domain User entity
import com.expensetracker.backend.repository.UserRepository; // Repository to find users by email
import org.springframework.security.core.userdetails.UserDetails; // Spring Security UserDetails interface
import org.springframework.security.core.userdetails.UserDetailsService; // Abstraction to load user by username
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Exception when user not found
import org.springframework.stereotype.Service; // Marks class as a Spring service

@Service // Register as Spring-managed service bean
public class CustomUserDetailsService implements UserDetailsService { // UserDetailsService implementation using our repository

    private final UserRepository userRepository; // Dependency: access to user data

    public CustomUserDetailsService(UserRepository userRepository) { // Constructor injection
        this.userRepository = userRepository; // Assign dependency
    }

    @Override // Implement load by username (email)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException { // Called by security framework
        User user = userRepository.findByEmail(username) // Look up user by email
                .orElseThrow(() -> new UsernameNotFoundException("User not found")); // Throw if absent
        return org.springframework.security.core.userdetails.User // Build Spring Security UserDetails
                .withUsername(user.getEmail()) // Set username
                .password(user.getPassword()) // Set hashed password
                .authorities("USER") // Assign a default role
                .build(); // Create immutable UserDetails
    }
}
