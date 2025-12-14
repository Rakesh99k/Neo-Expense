package com.expensetracker.backend.security; // Package: security filters

import jakarta.servlet.FilterChain; // Chain of filters to continue processing
import jakarta.servlet.ServletException; // Exception thrown by servlet operations
import jakarta.servlet.http.HttpServletRequest; // HTTP request abstraction
import jakarta.servlet.http.HttpServletResponse; // HTTP response abstraction
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Authentication token representing a user
import org.springframework.security.core.context.SecurityContextHolder; // Holds security context for current thread
import org.springframework.security.core.userdetails.UserDetails; // Spring Security user details interface
import org.springframework.security.core.userdetails.UserDetailsService; // Service to load user details by username
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource; // Helper to build authentication details from request
import org.springframework.stereotype.Component; // Marks class as Spring component
import org.springframework.web.filter.OncePerRequestFilter; // Base class to run filter once per request

import java.io.IOException; // IO exception type

@Component // Register filter as Spring component
public class JwtAuthFilter extends OncePerRequestFilter { // Filter to set authentication from JWT

    private final JwtService jwtService; // Utility to extract/validate JWT
    private final UserDetailsService userDetailsService; // Load user details when username is present

    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) { // Constructor injection
        this.jwtService = jwtService; // Assign JWT service
        this.userDetailsService = userDetailsService; // Assign user details service
    }

    @Override // Implement filter logic
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException { // Core filter method
        final String authHeader = request.getHeader("Authorization"); // Read Authorization header
        String username = null; // Will hold username from token
        String jwt = null; // Will hold raw token

        if (authHeader != null && authHeader.startsWith("Bearer ")) { // Check bearer scheme
            jwt = authHeader.substring(7); // Extract token after "Bearer "
            try {
                username = jwtService.extractUsername(jwt); // Parse subject (username)
            } catch (Exception ignored) {} // Silently ignore invalid tokens
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) { // If username found and no authentication set
            UserDetails userDetails = userDetailsService.loadUserByUsername(username); // Load user details
            if (jwtService.validateToken(jwt, userDetails)) { // Validate token against user
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken( // Build auth token
                        userDetails, null, userDetails.getAuthorities()); // Pass authorities
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // Attach request details
                SecurityContextHolder.getContext().setAuthentication(authToken); // Set authentication in context
            }
        }

        filterChain.doFilter(request, response); // Continue filter chain
    }
}
