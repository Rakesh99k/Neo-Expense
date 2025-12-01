# Neo-Expense Frontend (React + Vite)

## Overview
Neo-Expense frontend is a modern React application built with Vite. It delivers a fast, responsive expense tracking experience with dashboards, CRUD, reports, and settings. The app can operate in demo (no-auth) mode or connect to the Spring Boot backend via a centralized API client.

- Stack: React, Vite, React Router
- UI/UX: Framer Motion (animations), Recharts (charts)
- Data: Axios (HTTP), date-fns (dates), uuid (IDs), papaparse (CSV), pdf-lib (PDF)
- State: Hooks-based local state; derived stats computed client-side
- Theming: CSS variables with light/dark neon surfaces

## Project Structure
```
frontend/
├─ package.json
├─ vite.config.js
└─ src/
   ├─ App.jsx                     # Routes and theme application
   ├─ services/
   │  ├─ api.js                  # Axios instance and interceptors
   │  └─ auth.js                 # Login, register, logout helpers
   ├─ hooks/
   │  ├─ useExpenses.js          # Fetch & mutate expenses via API
   │  └─ usePrefs.js             # Fetch & update user preferences
   ├─ pages/
   │  ├─ Login.jsx               # Auth page (optional in demo)
   │  └─ Register.jsx            # Registration page (optional)
   ├─ components/                # UI components (tables, forms, charts)
   └─ assets/                    # Styles, images
```

## Key Concepts & Definitions
- Router: Client-side navigation using React Router.
- Hook: Reusable stateful logic (e.g., fetching, caching, mutations).
- Interceptor: Axios middleware that injects headers (e.g., Authorization).
- Derived state: Values computed from base data (totals, trends).
- Controlled form: Inputs bound to React state for validation.
- Theme variables: CSS custom properties for colors and surfaces.
- Demo mode: App runs without authentication; endpoints may be public.

## Data Flow
1. Components render pages and call hooks.
2. Hooks (`useExpenses`, `usePrefs`) call the centralized `api.js` client.
3. `api.js` sets baseURL (`http://localhost:8080/api`) and attaches JWT when present.
4. Responses hydrate component state; derived stats render charts and summaries.

## API Client (`src/services/api.js`)
- Creates an Axios instance with `baseURL`.
- Request interceptor adds `Authorization: Bearer <token>` if available.
- Exports the instance for use across hooks and services.

## Auth Service (`src/services/auth.js`)
- `login(email, password)`: POST to `/auth/login`, stores token.
- `register(payload)`: POST to `/auth/register`.
- `logout()`: Clears token and user info.
- Demo mode: These pages/components can be bypassed if security is disabled.

## Hooks
- useExpenses.js
  - load(): GET `/expenses` and set state.
  - add(expense): POST `/expenses`.
  - update(id, expense): PUT `/expenses/{id}`.
  - remove(id): DELETE `/expenses/{id}`.
  - Derived stats: totals by category, monthly summaries.

- usePrefs.js
  - load(): GET `/prefs`.
  - update(prefs): PUT `/prefs`.
  - Applies theme and currency preferences.

## Pages
- Dashboard: Overview cards, charts, recent activity.
- Expenses: CRUD list with filters and export (CSV/PDF).
- Reports: Trends by month/category using Recharts.
- Settings: Theme toggle, currency, budget.
- Login / Register: Optional when auth is enabled.

## Theming
- CSS variables define surface colors for light and neon modes.
- App.jsx applies the theme class or variables on mount and when prefs change.
- Encourage WCAG contrast for readability.

## Running Locally
Install dependencies and start the dev server.

Windows PowerShell:
```powershell
cd frontend
npm install
npm run dev
```

If using backend:
```powershell
# ensure backend is running on http://localhost:8080
# baseURL is configured in src/services/api.js
```

## Build
```powershell
cd frontend
npm run build
npm run preview
```

## Tips
- Keep package-lock.json committed for reproducible installs.
- Use environment variables (e.g., .env) for backend URL overrides.
- Prefer hook-based data access to keep components simple.
- Add error boundaries or toast notifications for API failures.
