import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { getStoredTheme, applyTheme } from './context/ThemeManager.js';
import './styles/theme.css';

// Apply theme IMMEDIATELY before React renders
// So there's no flash of wrong theme
applyTheme(getStoredTheme());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);