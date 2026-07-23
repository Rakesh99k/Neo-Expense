package com.expensetracker.backend.exception; // Package: custom exceptions

public class EntityNotFoundException extends RuntimeException { // Runtime exception indicating missing entity
    public EntityNotFoundException(String message) { super(message); } // Constructor passing message to base class
}
