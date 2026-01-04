# Future Upgrades & Suggestions

A practical, prioritized list of ideas to evolve the Expense Tracker. Grouped by product, frontend, backend, and operations.

## Product & UX
- Budgets & alerts: monthly/weekly caps with email/push notifications.
- Recurring expenses: auto-generate entries, skip/modify individual occurrences.
- Income tracking: visualize net savings and savings rate.
- Multi-currency: auto FX via a rate API; per-account currency setting.
- Tags & categories: custom tags, merge/split categories, color coding.
- Attach receipts: upload image/PDF to an expense; OCR to suggest category.
- Powerful search & filters: by amount range, date, merchant, tag, text.
- Advanced reporting: year-over-year, category drilldowns, top merchants, custom date ranges.
- Accessibility: keyboard navigation, screen reader improvements, color contrast.
- Internationalization (i18n): localized UI strings and number/date formatting.
- Offline/PWA: cache last N actions; sync when back online.

## Frontend (React/Vite)
- TypeScript: gradual adoption for `src/` to reduce runtime errors.
- State management: Redux Toolkit or Zustand for global prefs/auth; keep local state for forms.
- Data fetching & caching: TanStack Query (React Query) for server state, retries, cache.
- Forms & validation: React Hook Form + Zod for robust validation and UX.
- Testing: Vitest + React Testing Library (unit); Playwright (E2E) for critical flows.
- Performance: code-splitting via `React.lazy`, memoization, selector-based state.
- Error boundaries: graceful fallbacks and user-friendly error views.
- Theming: CSS variables, high-contrast/dark-mode refinements; theme persistence.
- Charts: unified charting lib, annotations, tooltips, and export-to-image.

## Backend (Spring Boot)
- Security: Spring Security with JWT access + refresh tokens; role-based access.
- Validation: Bean Validation (JSR 380) on DTOs with informative messages.
- Pagination/sorting: consistent across list endpoints; server-side filtering.
- Documentation: OpenAPI/Swagger UI; generate clients or docs automatically.
- Persistence: Flyway or Liquibase migrations; seed data profiles.
- Caching: Redis for frequent reads (e.g., category lists, preferences).
- Rate limiting: IP/user-based throttling to mitigate abuse.
- Audit logging: who/what/when changes on expenses and preferences.
- File storage: S3/Blob storage for receipts; signed URLs; antivirus scan.
- Testing: JUnit + Testcontainers for DB/integration; service-level unit tests.
- Observability: Micrometer metrics; structured logs (JSON); trace IDs.

## DevOps & Quality
- Docker: containerize backend/frontend; Compose for local full stack.
- CI/CD: GitHub Actions for lint/test/build; deploy to staging on main branch.
- Environments: `.env` management; secrets via GitHub/Cloud provider; config by profile.
- Dependency health: Dependabot updates; license/security scanning.
- Monitoring: Prometheus/Grafana; alerting on error rate/latency.
- Centralized logging: ELK/Opensearch; log retention and privacy controls.
- Backups: scheduled DB backups, restore drills, and retention policy.

## Data & Privacy
- GDPR-friendly privacy: clear data retention, export, and delete account features.
- Anonymized analytics: feature usage tracking with opt-in and privacy.
- Feature flags: gradual rollouts for risky changes; A/B experimentation.

## Architecture & Roadmap
- Modularization: clearer boundaries for auth, expenses, reports, preferences.
- API versioning: `/api/v1` with deprecation strategy and sunset headers.
- Multi-tenant (optional): user- or org-scoped data isolation.

### Suggested Timeline
- 30 days: TypeScript baseline, OpenAPI docs, pagination, Vitest unit tests, error boundaries.
- 60 days: JWT refresh tokens, React Query, Flyway migrations, Docker Compose, Playwright E2E.
- 90 days: Redis caching, audit logging, receipts storage, CI/CD with staging, observability stack.

### Notes
- Keep changes incremental with clear acceptance criteria.
- Prioritize reliability, testing, and documentation before new features.
- Measure impact: track performance, error rates, and user outcomes after releases.
