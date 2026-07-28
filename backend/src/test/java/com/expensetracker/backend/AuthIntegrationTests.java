package com.expensetracker.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AuthIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    // ── Helper: register and return token ──────────────────────
    private String registerAndGetToken(String email, String password) throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "%s"
                                }
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract token from JSON response string
        return response.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }

    // ── Test 1: Protected endpoint blocks unauthenticated ──────
    @Test
    void protectedEndpointsRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isUnauthorized()); // 401
    }

    // ── Test 2: Register returns token, token grants access ────
    @Test
    void registerReturnsTokenAndAllowsProtectedAccess() throws Exception {
        String token = registerAndGetToken(
                "auth-test@example.com",
                "StrongPass123"
        );

        // Token should work on protected endpoint
        mockMvc.perform(get("/api/expenses")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    // ── Test 3: Login works for registered user ─────────────────
    // FIXED: No longer depends on SeedRunner demo user
    // Creates its own test user first, then logs in
    @Test
    void registeredUserCanLogin() throws Exception {
        // First register the user
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "login-test@example.com",
                                  "password": "LoginPass123"
                                }
                                """))
                .andExpect(status().isOk());

        // Then login with same credentials
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "login-test@example.com",
                                  "password": "LoginPass123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.email").value("login-test@example.com"));
    }

    // ── Test 4: Wrong credentials return 401 ───────────────────
    @Test
    void wrongCredentialsReturn401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "nonexistent@example.com",
                                  "password": "wrongpassword"
                                }
                                """))
                .andExpect(status().isUnauthorized()); // 401
    }
}