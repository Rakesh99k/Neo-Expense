-- ═══════════════════════════════════════════════════════════════
-- v3.0 Migration: Budget + Savings + Recurring + Payment Method
-- Run in Neon SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation (if not already)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── BUDGETS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budgets (
                                       user_id         BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enabled         BOOLEAN NOT NULL DEFAULT false,
    monthly_amount  NUMERIC(19,4) NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL
    );

-- ── MONTHLY SNAPSHOTS (for savings history) ────────────────
CREATE TABLE IF NOT EXISTS monthly_snapshots (
                                                 id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year            INT NOT NULL,
    month           INT NOT NULL,
    budget_amount   NUMERIC(19,4) NOT NULL,
    spent_amount    NUMERIC(19,4) NOT NULL,
    saved_amount    NUMERIC(19,4) NOT NULL,
    finalized_at    TIMESTAMPTZ NOT NULL,
    UNIQUE(user_id, year, month)
    );

CREATE INDEX IF NOT EXISTS idx_snapshots_user_time
    ON monthly_snapshots(user_id, year DESC, month DESC);

-- ── RECURRING EXPENSES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS recurring_expenses (
                                                  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title             VARCHAR(255) NOT NULL,
    amount            NUMERIC(19,4) NOT NULL,
    category          VARCHAR(255) NOT NULL,
    payment_method    VARCHAR(50) NOT NULL DEFAULT 'CASH',
    notes             VARCHAR(2048),
    frequency         VARCHAR(20) NOT NULL,
    day_of_month      INT,
    day_of_week       INT,
    month_of_year     INT,
    active            BOOLEAN NOT NULL DEFAULT true,
    last_generated_at TIMESTAMPTZ,
    next_due_at       TIMESTAMPTZ NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL,
    updated_at        TIMESTAMPTZ NOT NULL
    );

CREATE INDEX IF NOT EXISTS idx_recurring_user_active
    ON recurring_expenses(user_id, active, next_due_at);

-- ── ADD COLUMNS TO EXISTING EXPENSES TABLE ─────────────────
ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) NOT NULL DEFAULT 'CASH';

ALTER TABLE expenses
    ADD COLUMN IF NOT EXISTS recurring_id UUID
    REFERENCES recurring_expenses(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_expenses_payment
    ON expenses(user_id, payment_method);

-- ── DEFAULT BUDGETS FOR EXISTING USERS ─────────────────────
INSERT INTO budgets (user_id, enabled, monthly_amount, created_at, updated_at)
SELECT id, false, 0, NOW(), NOW()
FROM users
WHERE id NOT IN (SELECT user_id FROM budgets);

-- ── VERIFICATION ───────────────────────────────────────────
SELECT 'budgets' AS table_name, COUNT(*) AS row_count FROM budgets
UNION ALL
SELECT 'monthly_snapshots', COUNT(*) FROM monthly_snapshots
UNION ALL
SELECT 'recurring_expenses', COUNT(*) FROM recurring_expenses
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses;