package com.expensetracker.backend.model;

public final class LendingType {

    public static final String LENT = "LENT";
    public static final String BORROWED = "BORROWED";

    public static final java.util.Set<String> ALL = java.util.Set.of(LENT, BORROWED);

    private LendingType() {}
}