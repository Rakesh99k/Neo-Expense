package com.expensetracker.backend.security; // Package: security configuration for the application

import org.springframework.context.annotation.Bean; // Marks a method that produces a bean managed by Spring
import org.springframework.context.annotation.Configuration; // Indicates this class declares Spring configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // Enables @PreAuthorize and similar method security
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Builder for HTTP security configuration
import org.springframework.security.config.http.SessionCreationPolicy; // Enum for session management policy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // BCrypt implementation of password hashing
import org.springframework.security.crypto.password.PasswordEncoder; // Interface for encoding passwords
import org.springframework.security.web.SecurityFilterChain; // Filter chain bean for configuring security
import org.springframework.web.cors.CorsConfiguration; // CORS configuration object
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Source mapping URLs to CORS configs
import org.springframework.web.filter.CorsFilter; // Filter to apply configured CORS rules

import java.util.List; // List type used for configuration values

@Configuration // Marks this class as a configuration source
@EnableMethodSecurity // Enable method-level security annotations
public class SecurityConfig { // Security configuration class

    @Bean // Expose SecurityFilterChain as a Spring bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { // Configure HTTP security
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF (appropriate for stateless APIs)
                .cors(cors -> {}) // Enable CORS support (details via CorsFilter bean)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Use stateless sessions for APIs
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Allow all requests (demo mode)
        return http.build(); // Build and return the filter chain
    }

    @Bean // Define a CORS filter bean
    public CorsFilter corsFilter() { // Configure allowed origins/headers/methods
        CorsConfiguration config = new CorsConfiguration(); // Create CORS config
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Allow frontend dev origin
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS")); // Allowed HTTP methods
        config.setAllowedHeaders(List.of("Authorization","Content-Type")); // Allowed headers
        config.setAllowCredentials(true); // Allow credentials (cookies/headers)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); // Map URLs to CORS config
        source.registerCorsConfiguration("/api/**", config); // Apply to API endpoints
        return new CorsFilter(source); // Return filter instance
    }

    @Bean // Password encoder bean used for hashing user passwords
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); } // BCrypt with default strength
}
