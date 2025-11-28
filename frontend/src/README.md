# NeoExpense Tracker

A futuristic, neon-accent React expense tracker built with Vite. Features include an animated Dashboard, full Expenses CRUD with pagination, rich Reports & export, and a Settings area for currency/theme preferences plus data backup & restore.

## Stack
- React 19 + Vite
- Recharts for charts
- Framer Motion for micro-interactions & page transitions
- date-fns for date utilities
- pdf-lib & papaparse (PDF/CSV export)
- uuid for unique IDs

## Current Features
- Animated Dashboard page
- Summary metrics: month total, year total, count
- Charts: Category Pie, Monthly Trend, Total Expenditure (placeholders if no data)
- LocalStorage abstraction (`services/storage.js` + hooks)
- Responsive neon + optional light theme (toggle in Settings)
- Expenses CRUD (list, add/edit modal, delete) with animated entries
- Pagination (10/25/50/100 per page) for large expense datasets
- Reports page: filtering (category, amount min/max, date from/to) with animated summary & table
- Export: PDF and CSV generation (internal blob download)
- Settings page: currency & theme preferences, backup JSON download, import validation & full reset

## Project Structure
```
src/
  App.jsx
  main.jsx
  styles/theme.css
  pages/Dashboard.jsx
  components/
    layout/Sidebar.jsx
    SummaryCard.jsx
    charts/
      CategoryPieChart.jsx
      MonthlyTrendChart.jsx
      TotalExpenditureChart.jsx
  hooks/
    useLocalStorage.js
    useExpenses.js
    usePrefs.js
  services/storage.js
  utils/format.js
  utils/reportExport.js
```

## Running
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Next Roadmap
1. Multi-category selection + enhanced combined filter UI on Expenses
2. Virtualized list option for 10k+ records
3. Enhanced animations (scroll reveal, batch export progress, table row shimmer)
4. Accessibility audit & keyboard shortcuts
5. Unit tests for hooks (useExpenses, usePrefs, storage abstraction)
6. Optional cloud sync adapter (future)

## Pagination Usage
Navigate to the Expenses page and use:
- Search box: filters by title substring (case-insensitive)
- Category select: narrows list to a single category
- Page size select: choose 10 / 25 / 50 / 100 items per page
- Prev / Next buttons: navigate pages; disabled at boundaries
Filters automatically reset to page 1 when changed.

## Reports Usage
Navigate to `/reports`:
- Set optional filters; empty fields mean no constraint.
- Preview updates live with animations.
- Click Export PDF or Export CSV (disabled while processing).
- File is named `expenses-report-YYYYMMDD-HHmm.(pdf|csv)`.
If no rows match filters, export buttons will produce empty file with headers.

## Settings Usage
Navigate to `/settings`:
- Currency: choose from common ISO codes; affects all monetary formatting.
- Theme: switch between `neon` (default) and `light` (body `data-theme` attribute drives CSS variable override).
- Download Backup JSON: saves a single file `neoexpense-backup.json` containing `{ expenses: [...], prefs: { currency, theme } }`.
- Import Backup: validates structure (must include array `expenses` and object `prefs`). On success, replaces local data and applies preferences immediately.
- Reset Data: Clears all expenses and resets preferences to defaults after confirmation.
- Preview: Live JSON snapshot of current stored data for quick inspection.

## Backup JSON Structure
```json
{
  "expenses": [
    {
      "id": "uuid",
      "title": "Groceries",
      "amount": 120.45,
      "category": "Food",
      "date": "2024-02-15T14:20:11.000Z",
      "notes": "Optional"
    }
  ],
  "prefs": {
    "currency": "USD",
    "theme": "neon"
  }
}
```

## Currency Formatting
`formatCurrency(value)` automatically reads the stored preference (`et_prefs.currency`) with fallback to `USD`. A manual override can be passed for edge cases.

## Adding Expenses Programmatically (Temporary)
Use DevTools console:
```js
localStorage.setItem('et_expenses', JSON.stringify([
  { id: 'seed1', title: 'Groceries', amount: 120.45, category: 'Food', date: new Date().toISOString(), notes: '' }
]));
```
Reload to see charts update.

## Style & Conventions
- Functional components only
- Hooks for cross-cutting logic
- Keep components small & cohesive
- Favor composition over prop drilling
- Utility functions grouped under `utils/`
 - Page-level concerns live under `pages/`; app-wide layout under `components/layout/`
 - Persistence keys use `et_` prefix to avoid collisions

## License
Internal / Unlicensed (add if needed)
