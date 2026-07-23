package com.expensetracker.backend.security; // Package: JWT utility services

import io.jsonwebtoken.Claims; // JWT claims interface
import io.jsonwebtoken.Jwts; // JWT builder and parser
import io.jsonwebtoken.SignatureAlgorithm; // Enum for signing algorithms
import io.jsonwebtoken.io.Decoders; // Utility to decode Base64 strings
import io.jsonwebtoken.security.Keys; // Utility to create HMAC signing keys
import org.springframework.beans.factory.annotation.Value; // Inject configuration values
import org.springframework.security.core.userdetails.UserDetails; // Spring Security user abstraction
import org.springframework.stereotype.Service; // Service stereotype

import java.nio.charset.StandardCharsets; // Charset for raw secret bytes fallback
import java.security.Key; // Cryptographic key type
import java.util.Date; // Date for issued/expiry timestamps
import java.util.Map; // Map for extra claims

@Service // Register as Spring service
public class JwtService { // Provides functionalities to generate and validate JWTs

    @Value("${jwt.secret}") // Inject secret from application properties
    private String secret; // Secret used to sign/verify JWT tokens

    private Key getSigningKey() { // Build signing key from configured secret
        // Try Base64 first; if it fails, use raw UTF-8 bytes so dev secrets like "change-me-in-dev" work.
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret); // Attempt Base64 decode
            return Keys.hmacShaKeyFor(keyBytes); // Create HMAC key
        } catch (IllegalArgumentException ex) { // If not valid Base64
            byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8); // Use raw bytes
            return Keys.hmacShaKeyFor(keyBytes); // Create HMAC key
        }
    }

    public String generateToken(UserDetails userDetails) { // Create a signed JWT for a user
        long now = System.currentTimeMillis(); // Current time in ms
        return Jwts.builder() // Start building JWT
                .setSubject(userDetails.getUsername()) // Subject = username
                .addClaims(Map.of()) // No extra claims in demo
                .setIssuedAt(new Date(now)) // Issue time
                .setExpiration(new Date(now + 1000L * 60 * 60 * 24)) // Expiration: 24 hours
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign with HS256 and key
                .compact(); // Build token string
    }

    public String extractUsername(String token) { // Get subject (username) from token
        return getAllClaims(token).getSubject(); // Parse claims and return subject
    }

    public boolean validateToken(String token, UserDetails userDetails) { // Validate token for given user
        final String username = extractUsername(token); // Extract subject
        Claims claims = getAllClaims(token); // Parse all claims
        return (username.equals(userDetails.getUsername())) && claims.getExpiration().after(new Date()); // Compare usernames and expiration
    }

    private Claims getAllClaims(String token) { // Parse token and return claims body
        return Jwts.parserBuilder() // Create parser builder
                .setSigningKey(getSigningKey()) // Provide signing key
                .build() // Build parser
                .parseClaimsJws(token) // Parse JWS
                .getBody(); // Return claims
    }
}
