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
class RecurringIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    private String registerAndGetToken() throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Recurring",
                                  "lastName": "Tester",
                                  "email": "recurring-test@example.com",
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
    void listRecurringRequiresAuth() throws Exception {
        mockMvc.perform(get("/api/recurring"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createMonthlyRecurringSucceeds() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(post("/api/recurring")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Netflix",
                                  "amount": 500,
                                  "category": "Entertainment",
                                  "paymentMethod": "CREDIT_CARD",
                                  "notes": "Monthly subscription",
                                  "frequency": "MONTHLY",
                                  "dayOfMonth": 15
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Netflix"))
                .andExpect(jsonPath("$.frequency").value("MONTHLY"))
                .andExpect(jsonPath("$.dayOfMonth").value(15))
                .andExpect(jsonPath("$.active").value(true))
                .andExpect(jsonPath("$.paymentMethod").value("CREDIT_CARD"));
    }

    @Test
    void createWeeklyRecurringRequiresDayOfWeek() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(post("/api/recurring")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Weekly Groceries",
                                  "amount": 500,
                                  "category": "Food",
                                  "paymentMethod": "CASH",
                                  "frequency": "WEEKLY"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void invalidFrequencyRejected() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(post("/api/recurring")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Test",
                                  "amount": 100,
                                  "category": "Other",
                                  "paymentMethod": "CASH",
                                  "frequency": "DAILY"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}