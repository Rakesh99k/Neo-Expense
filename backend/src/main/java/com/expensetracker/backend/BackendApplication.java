package com.expensetracker.backend; // Package: root application class for Spring Boot

import org.springframework.boot.SpringApplication; // Utility to bootstrap and launch Spring application
import org.springframework.boot.autoconfigure.SpringBootApplication; // Annotation enabling auto-configuration and component scanning

@SpringBootApplication // Marks this as a Spring Boot application (auto-config + scan com.expensetracker.backend)
public class BackendApplication { // Main entry point class

	public static void main(String[] args) { // JVM entry point method
		SpringApplication.run(BackendApplication.class, args); // Start Spring Boot application context
	}

}
