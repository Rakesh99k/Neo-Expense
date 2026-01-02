# Expense Tracker – Full Stack Guide

A single repo containing a React (Vite) frontend and a Spring Boot backend for tracking expenses, preferences, and generating reports.

## Overview
- Frontend: React + Vite, hooks-based data access, charts and reports.
- Backend: Spring Boot REST API with layered architecture (Controller → Service → Repository → Model).
- Auth: Frontend wired for JWT; backend auth endpoints are currently disabled for demo mode.
- Database: PostgreSQL by default (configurable), can use H2 for demos.

## Monorepo Structure
```
backend/
  src/main/java/com/expensetracker/backend/
    controller/            # REST endpoints (expenses, prefs; auth demo-disabled)
    dto/                   # Request/Response DTOs
    exception/             # Centralized exception handling
    model/                 # JPA entities (Expense, Preference, ...)
    repository/            # Spring Data JPA repositories
    security/              # JWT & security config (can be toggled)
    service/               # Business logic
    config/                # Seed data configuration & runner
  src/main/resources/application.properties

frontend/
  src/
    services/              # Axios client and auth helpers
    hooks/                 # Data hooks (useExpenses, usePrefs)
    components/            # UI components, charts, tables
    pages/                 # Dashboard, Expenses, Reports, Settings, Auth
    styles/                # Theme and CSS variables
    utils/                 # Formatters and export helpers
```

See detailed sub-project docs:
- Frontend: [frontend/README.md](frontend/README.md)
- Backend: [backend/README.md](backend/README.md)

## Data Flow
- Frontend calls the backend via a centralized Axios client at [frontend/src/services/api.js](frontend/src/services/api.js).
- JWT (if present) is attached as `Authorization: Bearer <token>`.
- Key hooks:
  - [frontend/src/hooks/useExpenses.js](frontend/src/hooks/useExpenses.js) → CRUD on `/api/expenses`.
  - [frontend/src/hooks/usePrefs.js](frontend/src/hooks/usePrefs.js) → GET/PUT `/api/prefs`.

## API Summary
Base URL: `http://localhost:8080`

- Expenses: [backend/src/main/java/com/expensetracker/backend/controller/ExpenseController.java](backend/src/main/java/com/expensetracker/backend/controller/ExpenseController.java)
  - `GET /api/expenses` → List expenses
  - `POST /api/expenses` → Create expense
  - `PUT /api/expenses/{id}` → Update expense
  - `DELETE /api/expenses/{id}` → Delete expense

- Preferences: [backend/src/main/java/com/expensetracker/backend/controller/PreferenceController.java](backend/src/main/java/com/expensetracker/backend/controller/PreferenceController.java)
  - `GET /api/prefs` → Get user preferences
  - `PUT /api/prefs` → Update preferences

- Auth (demo mode: disabled in backend): [backend/src/main/java/com/expensetracker/backend/controller/AuthController.java](backend/src/main/java/com/expensetracker/backend/controller/AuthController.java)
  - Frontend functions exist in [frontend/src/services/auth.js](frontend/src/services/auth.js) (`/api/auth/register`, `/api/auth/login`). Enable backend security and controllers to use these.

## Key Files
- Backend entry: [backend/src/main/java/com/expensetracker/backend/BackendApplication.java](backend/src/main/java/com/expensetracker/backend/BackendApplication.java)
- Backend config: [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties)
- Frontend entry: [frontend/src/main.jsx](frontend/src/main.jsx), [frontend/src/App.jsx](frontend/src/App.jsx)
- Axios client: [frontend/src/services/api.js](frontend/src/services/api.js)

## Setup (Windows)

### Prerequisites
- Node.js 18+ and npm
- Java 21 (or compatible JDK)
- Optional: Docker for PostgreSQL

### Backend
1. Configure database in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties). Defaults:
   ```properties
   server.port=8080
   spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker_db
   spring.datasource.username=postgres
   spring.datasource.password=admin
   spring.jpa.hibernate.ddl-auto=update
   jwt.secret=${JWT_SECRET:change-me-in-dev}
   ```
2. Start PostgreSQL (optional example using Docker):
   ```powershell
   docker run -p 5432:5432 -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=postgres -e POSTGRES_DB=expense_tracker_db postgres:16
   ```
3. Run the backend:
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

### Frontend
By default, the Axios client targets `http://localhost:8080` (see [frontend/src/services/api.js](frontend/src/services/api.js)).

1. Install and run:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Open the dev server URL shown by Vite (typically `http://localhost:5173`).

## Authentication Modes
- Demo (current): Backend `AuthController` is disabled. Frontend can navigate without login. Expense and preference endpoints are available as configured.
- Secure: Re-enable backend security and auth endpoints under `/api/auth`. Frontend `auth.js` will then handle `register` and `login` and persist JWT to `localStorage`.

## Entities & DTOs
- Entities: [backend/src/main/java/com/expensetracker/backend/model](backend/src/main/java/com/expensetracker/backend/model)
- DTOs: [backend/src/main/java/com/expensetracker/backend/dto](backend/src/main/java/com/expensetracker/backend/dto)
- Exception handling: [backend/src/main/java/com/expensetracker/backend/exception/GlobalExceptionHandler.java](backend/src/main/java/com/expensetracker/backend/exception/GlobalExceptionHandler.java)

## Seeding
Seed support is available under [backend/src/main/java/com/expensetracker/backend/config](backend/src/main/java/com/expensetracker/backend/config) via `SeedConfig` and `SeedRunner` to populate demo data at startup.

## Development Tips
- Prefer using hooks (`useExpenses`, `usePrefs`) for data access in the frontend.
- Keep controllers thin; put logic in services and use DTOs to validate payloads.
- Externalize secrets with environment variables (e.g., `JWT_SECRET`).
- Use `spring.jpa.open-in-view=false` and DTOs to avoid lazy loading pitfalls in controllers.
