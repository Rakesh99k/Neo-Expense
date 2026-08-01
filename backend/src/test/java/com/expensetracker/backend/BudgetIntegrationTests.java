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
class BudgetIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    private String registerAndGetToken() throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Budget",
                                  "lastName": "Tester",
                                  "email": "budget-test@example.com",
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
    void budgetRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/budget"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getBudgetReturnsDefaultDisabled() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(get("/api/budget")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.monthlyAmount").value(0))
                .andExpect(jsonPath("$.status").value("disabled"));
    }

    @Test
    void updateBudgetEnablesAndSetsAmount() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(put("/api/budget")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "enabled": true,
                                  "monthlyAmount": 30000
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(true))
                .andExpect(jsonPath("$.monthlyAmount").value(30000))
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.daysLeftInMonth").isNumber());
    }

    @Test
    void budgetStatusChangesBasedOnSpending() throws Exception {
        String token = registerAndGetToken();

        // Set budget to 1000
        mockMvc.perform(put("/api/budget")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "enabled": true,
                                  "monthlyAmount": 1000
                                }
                                """))
                .andExpect(status().isOk());

        // Add an expense of 800 (80% of budget → warning)
        mockMvc.perform(post("/api/expenses")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "title": "Test",
                                  "amount": 800,
                                  "category": "Food",
                                  "date": "%s",
                                  "notes": ""
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/budget")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("warning"))
                .andExpect(jsonPath("$.currentMonthSpent").value(800))
                .andExpect(jsonPath("$.currentMonthRemaining").value(200));
    }
}