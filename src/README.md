# NeoExpense Tracker

A futuristic, neon-accent React expense tracker built with Vite. This initial scaffold implements the Dashboard with animated summary cards and dynamic charts (Recharts + Framer Motion) backed by a localStorage persistence layer.

## Stack
- React 19 + Vite
- Recharts for charts
- Framer Motion for micro-interactions & page transitions
- date-fns for date utilities
- pdf-lib & papaparse (export to PDF/CSV in upcoming features)
- uuid for unique IDs

## Current Features (Phase 1)
- Animated Dashboard page
- Summary metrics: month total, year total, count
- Charts: Category Pie, Monthly Trend, Total Expenditure (placeholders if no data)
- LocalStorage abstraction (`services/storage.js` + hooks)
- Responsive neon theme + sidebar navigation
- Expenses CRUD (list, add/edit modal, delete) with animated entries
- Pagination (10/25/50/100 per page) for large expense datasets
- Reports page: filtering (category, amount min/max, date from/to) with animated summary & table
- Export: PDF and CSV generation (internal blob download)

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
  services/storage.js
  utils/format.js
```

## Running
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Next Roadmap
1. Multi-category selection + amount/date range on Expenses page (consolidate advanced filtering)
2. Settings (currency selection, theme toggle, data backup/import/export)
3. Virtualized list option for 10k+ records
4. Enhanced animations (scroll reveal, batch export progress, table row shimmer)
5. Accessibility audit & keyboard shortcuts
6. Unit tests for hooks (useExpenses, storage abstraction)

## Pagination Usage
## Reports Usage
Navigate to `/reports`:
- Set optional filters; empty fields mean no constraint.
- Preview updates live with animations.
- Click Export PDF or Export CSV (disabled while processing).
- File is named `expenses-report-YYYYMMDD-HHmm.(pdf|csv)`.
If no rows match filters, export buttons will produce empty file with headers.
Navigate to the Expenses page and use:
- Search box: filters by title substring (case-insensitive)
- Category select: narrows list to a single category
- Page size select: choose 10 / 25 / 50 / 100 items per page
- Prev / Next buttons: navigate pages; disabled at boundaries
Filters automatically reset to page 1 when changed.

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

## License
Internal / Unlicensed (add if needed)
