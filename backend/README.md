# Neo-Expense Backend (Spring Boot)

## Overview
Neo-Expense backend is a Spring Boot REST API that powers the expense tracker frontend. It provides endpoints for managing users, expenses, and user preferences. The backend is designed with clean layering (Controller → Service → Repository → Model) and optional JWT-based authentication. For demos, security can be relaxed to allow public access to core endpoints.

- Framework: Spring Boot
- Build tool: Maven (Maven Wrapper included)
- Database: H2 (in-memory) or PostgreSQL/MySQL (configurable)
- Auth: JWT (stateless), can be disabled for demo mode
- Style: DTOs for request/response, Global Exception Handling

## Project Structure
```
backend/
├─ pom.xml
├─ mvnw, mvnw.cmd, .mvn/wrapper/
├─ src/
│  ├─ main/
│  │  ├─ java/com/expensetracker/backend/
│  │  │  ├─ BackendApplication.java        # Spring Boot entry point
│  │  │  ├─ controller/                    # REST controllers
│  │  │  │  ├─ AuthController.java
│  │  │  │  ├─ ExpenseController.java
│  │  │  │  └─ PreferenceController.java
│  │  │  ├─ dto/                           # Data transfer objects
│  │  │  │  ├─ AuthDtos.java
│  │  │  │  ├─ ExpenseDtos.java
│  │  │  │  └─ PreferenceDtos.java
│  │  │  ├─ exception/
│  │  │  │  ├─ EntityNotFoundException.java
│  │  │  │  └─ GlobalExceptionHandler.java
│  │  │  ├─ model/                         # JPA entities
│  │  │  │  ├─ User.java
│  │  │  │  ├─ Expense.java
│  │  │  │  └─ Preference.java
│  │  │  ├─ repository/                    # Spring Data JPA repositories
│  │  │  │  ├─ UserRepository.java
│  │  │  │  ├─ ExpenseRepository.java
│  │  │  │  └─ PreferenceRepository.java
│  │  │  ├─ security/                      # JWT + Security config
│  │  │  │  ├─ CustomUserDetailsService.java
│  │  │  │  ├─ JwtAuthFilter.java
│  │  │  │  ├─ JwtService.java
│  │  │  │  └─ SecurityConfig.java
│  │  │  ├─ service/                        # Business logic
│  │  │  │  ├─ AuthService.java
│  │  │  │  ├─ ExpenseService.java
│  │  │  │  └─ PreferenceService.java
│  │  │  ├─ seed/                           # Demo seeders
│  │  │  │  ├─ SeedConfig.java
│  │  │  │  └─ SeedRunner.java
│  │  └─ resources/
│  │     ├─ application.properties
│  └─ test/
│     └─ java/com/expense_tracker/backend/BackendApplicationTests.java
└─ README.md
```

## Key Concepts & Definitions
- Controller: The REST layer that maps HTTP requests to service methods.
- Service: Encapsulates business logic and orchestrates repository calls.
- Repository: Spring Data JPA interfaces for CRUD and queries.
- Entity: JPA annotated class mapping to a database table.
- DTO: Data Transfer Object used to validate/shape API payloads.
- Global Exception Handler: Centralizes error responses (e.g., 404, 400).
- JWT: Token-based stateless authentication using signed tokens.
- Filter: Intercepts requests to extract/validate JWT and set security context.

## Entities
- User: `id`, `email`, `passwordHash`, `createdAt`
- Expense: `id`, `userId`, `amount`, `category`, `note`, `date`
- Preference: `id`, `userId`, `currency`, `theme`, `monthlyBudget`

## Controllers & Endpoints
Base path: `/api`

- AuthController
  - `POST /api/auth/register` → Register user
  - `POST /api/auth/login` → Login, returns JWT

- ExpenseController
  - `GET /api/expenses` → List expenses (optionally by user)
  - `POST /api/expenses` → Create expense
  - `PUT /api/expenses/{id}` → Update expense
  - `DELETE /api/expenses/{id}` → Delete expense

- PreferenceController
  - `GET /api/prefs` → Get user preferences
  - `PUT /api/prefs` → Update preferences

## Security (JWT)
- `SecurityConfig`: Configures HTTP security, cors, csrf, and authorized routes.
- `JwtService`: Issues and verifies tokens.
- `JwtAuthFilter`: Extracts `Authorization: Bearer <token>` and validates it.
- `CustomUserDetailsService`: Loads `UserDetails` for auth.

Demo mode: Security can be relaxed to allow anonymous access while retaining the same API shapes. This helps frontend integration even before authentication is finalized.

## Validation & Error Handling
- DTOs enforce required fields and types.
- `GlobalExceptionHandler` formats errors consistently with status codes and messages.
- `EntityNotFoundException` signals missing resources (404).

## Seeding
- `SeedRunner` uses `CommandLineRunner` to insert demo data at startup.
- Controlled by `SeedConfig` bean definitions.

## Configuration
`src/main/resources/application.properties` contains DB and security settings.

H2 example:
```
spring.datasource.url=jdbc:h2:mem:neoexpense;DB_CLOSE_DELAY=-1
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
```

PostgreSQL example:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/neoexpense
spring.datasource.username=postgres
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update
```

JWT example:
```
security.jwt.secret=change_me_to_a_long_random_secret
security.jwt.expMinutes=60
```

## Build & Run
Use Maven Wrapper for consistent builds.

Windows PowerShell:
```powershell
cd backend
./mvnw.cmd clean package
java -jar target/backend-*.jar
```

Or run in dev mode:
```powershell
cd backend
./mvnw.cmd spring-boot:run
```

## Testing
Basic context-load test is provided under `src/test`. Extend with service and controller tests using `@SpringBootTest` or `@WebMvcTest`.

## Notes
- Keep secrets out of version control; use env vars or externalized config.
- Switch between demo and secure modes by adjusting `SecurityConfig` and controller annotations.
- DTOs and services aim to keep controllers thin and maintainable.
# Expense Tracker Backend

Spring Boot 3.5.x (Java 21) + PostgreSQL + JWT.

## Environment
- DB_USER, DB_PASS
- JWT_SECRET (base64-encoded secret)
```
curl http://localhost:8080/api/expenses -H "Authorization: Bearer $token"
# List expenses

$token = (curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"demo@example.com","password":"DemoPass123"}').token
# Login

curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{"email":"demo@example.com","password":"DemoPass123"}'
# Register
```powershell
## Example

- PUT /api/prefs (Bearer)
- GET /api/prefs (Bearer)
- DELETE /api/expenses/{id} (Bearer)
- PUT /api/expenses/{id} (Bearer)
- POST /api/expenses (Bearer)
- GET /api/expenses (Bearer) -> [ExpenseResponse]
- POST /api/auth/login {email,password} -> {token,email}
- POST /api/auth/register {email,password} -> {token,email}
## Endpoints

```
docker run -p 5432:5432 -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=expense_tracker_db postgres:16
```powershell
## Docker DB

```
mvn spring-boot:run
```powershell
## Run


