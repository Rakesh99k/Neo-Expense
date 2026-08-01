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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class SavingsIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    private String registerAndGetToken() throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Savings",
                                  "lastName": "Tester",
                                  "email": "savings-test@example.com",
                                  "password": "TestPass123"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return response.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }

    @Test
    void savingsRequiresAuth() throws Exception {
        mockMvc.perform(get("/api/savings"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void savingsReturnsZeroWhenNoBudget() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(get("/api/savings")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSaved").value(0))
                .andExpect(jsonPath("$.currentMonthProjected").value(0))
                .andExpect(jsonPath("$.history").isArray());
    }

    @Test
    void savingsShowsProjectedWhenBudgetEnabled() throws Exception {
        String token = registerAndGetToken();

        // Enable budget of 5000
        mockMvc.perform(put("/api/budget")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "enabled": true,
                                  "monthlyAmount": 5000
                                }
                                """))
                .andExpect(status().isOk());

        // Add expense of 1000 → projected saving = 4000
        mockMvc.perform(post("/api/expenses")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "title": "Test",
                                  "amount": 1000,
                                  "category": "Food",
                                  "date": "%s",
                                  "notes": ""
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/savings")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentMonthProjected").value(4000));
    }
}