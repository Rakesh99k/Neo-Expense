package com.expensetracker.backend.exception;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String message) { super(message); }
}

