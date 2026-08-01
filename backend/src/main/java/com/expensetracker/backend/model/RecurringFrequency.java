package com.expensetracker.backend.model;

/**
 * How often a recurring expense repeats.
 */
public final class RecurringFrequency {

    public static final String WEEKLY = "WEEKLY";
    public static final String MONTHLY = "MONTHLY";
    public static final String YEARLY = "YEARLY";

    public static final java.util.Set<String> ALL = java.util.Set.of(
            WEEKLY, MONTHLY, YEARLY
    );

    private RecurringFrequency() {}
}