package com.expensetracker.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    // FIXED: now returns 401 (not 403) because of custom AuthenticationEntryPoint
    @Test
    void protectedEndpointsRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isUnauthorized()); // 401
    }

    @Test
    void registerReturnsTokenAndAllowsProtectedAccess() throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "auth-test@example.com",
                                  "password": "StrongPass123"
                                }
                                """))
                .andExpect(status().isOk())                             // 200
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.email").value("auth-test@example.com"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract token from JSON response
        String token = response.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");

        // Use token to access protected endpoint
        mockMvc.perform(get("/api/expenses")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());                            // 200
    }

    @Test
    void demoUserCanLogin() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "demo@example.com",
                                  "password": "DemoPass123"
                                }
                                """))
                .andExpect(status().isOk())                             // 200
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.email").value("demo@example.com"));
    }

    // FIXED: bad credentials now returns 401 (handled by GlobalExceptionHandler)
    @Test
    void authEndpointsArePublic() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "nonexistent@example.com",
                                  "password": "wrongpassword"
                                }
                                """))
                .andExpect(status().isUnauthorized()); // FIXED: 401 not 500
    }
}