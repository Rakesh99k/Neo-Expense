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
1. Expense CRUD UI (list, add modal, edit, delete animations)
2. Advanced filtering & search
3. Reports page with PDF & CSV export (filters: date range, category, min/max)
4. Settings (currency, theme toggles, data backup)
5. Enhanced animations (scroll reveals, staggered list inserts, delete collapse)
6. Accessibility audit & keyboard shortcuts

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
