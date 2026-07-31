import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../../constants/index.js';
import { getStoredTheme, setStoredTheme } from '../../context/ThemeManager.js';

/**
 * PublicThemePicker
 * Theme selector for login/register pages.
 * Uses localStorage directly since PrefsContext is not available here.
 * Once user logs in, PrefsContext syncs with backend.
 */
export default function PublicThemePicker() {
  const [open, setOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());

  // Keep in sync if theme changes elsewhere
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = getStoredTheme();
      if (stored !== currentTheme) {
        setCurrentTheme(stored);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [currentTheme]);

  function handleSelect(themeId) {
    setStoredTheme(themeId);
    setCurrentTheme(themeId);
    setOpen(false);
  }

  return (
    <div className="theme-picker">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="theme-picker-trigger"
        aria-label="Change theme"
      >
        <IconTheme />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="theme-picker-backdrop"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="theme-picker-popup"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="theme-picker-header">
                <span>Choose Theme</span>
              </div>
              <div className="theme-picker-list">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelect(theme.id)}
                    className={`theme-picker-option ${
                      currentTheme === theme.id ? 'active' : ''
                    }`}
                  >
                    <div
                      className="theme-preview"
                      style={{
                        background: theme.preview.bg,
                        border: `2px solid ${theme.preview.accent}`
                      }}
                    >
                      <div
                        className="theme-preview-dot"
                        style={{ background: theme.preview.accent }}
                      />
                    </div>
                    <div className="theme-info">
                      <div className="theme-name">
                        <span>{theme.icon}</span>
                        <span>{theme.label}</span>
                      </div>
                      <div className="theme-desc">{theme.description}</div>
                    </div>
                    {currentTheme === theme.id && <IconCheck />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconTheme() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}