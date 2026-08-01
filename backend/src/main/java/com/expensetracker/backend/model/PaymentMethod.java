package com.expensetracker.backend.model;

/**
 * Payment method constants.
 * Stored as VARCHAR in DB, restricted to these values.
 */
public final class PaymentMethod {

    public static final String CASH = "CASH";
    public static final String DEBIT_UPI = "DEBIT_UPI";
    public static final String CREDIT_CARD = "CREDIT_CARD";
    public static final String WALLET = "WALLET";
    public static final String BANK_TRANSFER = "BANK_TRANSFER";
    public static final String OTHER = "OTHER";

    public static final java.util.Set<String> ALL = java.util.Set.of(
            CASH, DEBIT_UPI, CREDIT_CARD, WALLET, BANK_TRANSFER, OTHER
    );

    private PaymentMethod() {}
}