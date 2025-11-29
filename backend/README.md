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


