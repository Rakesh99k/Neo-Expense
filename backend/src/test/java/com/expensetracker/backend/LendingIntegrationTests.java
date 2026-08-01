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
class LendingIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    private String registerAndGetToken() throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "firstName": "Lending",
                                  "lastName": "Tester",
                                  "email": "lending-test@example.com",
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
    void lendingRequiresAuth() throws Exception {
        mockMvc.perform(get("/api/lending"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createLentSucceeds() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(post("/api/lending")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "type": "LENT",
                                  "personName": "John",
                                  "originalAmount": 500,
                                  "notes": "Coffee money",
                                  "date": "%s"
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("LENT"))
                .andExpect(jsonPath("$.personName").value("John"))
                .andExpect(jsonPath("$.originalAmount").value(500))
                .andExpect(jsonPath("$.returnedAmount").value(0))
                .andExpect(jsonPath("$.remainingAmount").value(500))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void invalidTypeRejected() throws Exception {
        String token = registerAndGetToken();

        mockMvc.perform(post("/api/lending")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "type": "INVALID",
                                  "personName": "John",
                                  "originalAmount": 500,
                                  "date": "%s"
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isBadRequest());
    }

    @Test
    void partialPaymentUpdatesStatus() throws Exception {
        String token = registerAndGetToken();

        // Create lending
        String createResponse = mockMvc.perform(post("/api/lending")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "type": "LENT",
                                  "personName": "Alice",
                                  "originalAmount": 1000,
                                  "date": "%s"
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String id = createResponse.replaceAll(".*\"id\":\"([^\"]+)\".*", "$1");

        // Record partial payment of 400
        mockMvc.perform(post("/api/lending/" + id + "/payment")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "amount": 400,
                                  "date": "%s"
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.returnedAmount").value(400))
                .andExpect(jsonPath("$.remainingAmount").value(600))
                .andExpect(jsonPath("$.status").value("PARTIAL"));
    }

    @Test
    void fullPaymentMarksSettled() throws Exception {
        String token = registerAndGetToken();

        String createResponse = mockMvc.perform(post("/api/lending")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "type": "LENT",
                                  "personName": "Bob",
                                  "originalAmount": 500,
                                  "date": "%s"
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String id = createResponse.replaceAll(".*\"id\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(post("/api/lending/" + id + "/payment")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "amount": 500,
                                  "date": "%s"
                                }
                                """, java.time.Instant.now())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SETTLED"))
                .andExpect(jsonPath("$.remainingAmount").value(0));
    }

    @Test
    void summaryReturnsCorrectTotals() throws Exception {
        String token = registerAndGetToken();

        // Lent 500
        mockMvc.perform(post("/api/lending")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {"type":"LENT","personName":"John","originalAmount":500,"date":"%s"}
                                """, java.time.Instant.now())))
                .andExpect(status().isOk());

        // Borrowed 200
        mockMvc.perform(post("/api/lending")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {"type":"BORROWED","personName":"Alice","originalAmount":200,"date":"%s"}
                                """, java.time.Instant.now())))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/lending/summary")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.owedToYou").value(500))
                .andExpect(jsonPath("$.youOwe").value(200))
                .andExpect(jsonPath("$.netPosition").value(300))
                .andExpect(jsonPath("$.activeLentCount").value(1))
                .andExpect(jsonPath("$.activeBorrowedCount").value(1));
    }
}