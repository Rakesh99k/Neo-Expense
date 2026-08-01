package com.expensetracker.backend.model;

public final class LendingStatus {

    public static final String ACTIVE = "ACTIVE";
    public static final String PARTIAL = "PARTIAL";
    public static final String SETTLED = "SETTLED";

    public static final java.util.Set<String> ALL = java.util.Set.of(ACTIVE, PARTIAL, SETTLED);

    private LendingStatus() {}
}