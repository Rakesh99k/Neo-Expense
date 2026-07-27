/**
 * Settings
 * Preference management (currency, theme) and data backup.
 * - Reads and writes preferences via backend API through shared PrefsContext.
 * - Backup downloads current expenses and prefs as JSON.
 * - Import restores preferences only (expenses need backend bulk import).
 */
import { useEffect, useRef, useState } from 'react';
import { usePrefs } from '../hooks/usePrefs.js';
import { useExpenses } from '../hooks/useExpenses.js';
import { motion } from 'framer-motion';

const currencies = ['INR', 'USD', 'EUR', 'GBP'];
const themes = [
  { id: 'neon-noir', label: 'Neon Noir', description: 'Netflix-style dark purple & gold' },
  { id: 'western-comic', label: 'Western Comic', description: 'Bold pop-art with halftone dots' },
  { id: 'manga', label: 'Manga', description: 'Clean minimal Japanese style' },
  { id: 'cartoon-flat', label: 'Cartoon Flat', description: 'Bright, rounded, playful' },
  { id: 'graphic-novel', label: 'Graphic Novel', description: 'Dark moody dramatic panels' }
];

export default function Settings() {
  const { prefs, updatePref } = usePrefs();
  const { expenses } = useExpenses();

  // Preference save state
  const [savingPreference, setSavingPreference] = useState(false);
  const [preferenceError, setPreferenceError] = useState('');
  const [preferenceSuccess, setPreferenceSuccess] = useState('');

  // Backup/import state
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [backupJson, setBackupJson] = useState('');

  // Apply theme to body whenever prefs.theme changes
  useEffect(() => {
    document.body.dataset.theme = prefs.theme || 'neon';
  }, [prefs.theme]);

  // Rebuild backup preview whenever prefs or expenses change
  useEffect(() => {
    const data = {
      version: 1,
      generatedAt: new Date().toISOString(),
      expenses,
      prefs
    };
    setBackupJson(JSON.stringify(data, null, 2));
  }, [prefs, expenses]);

  /**
   * handlePreferenceChange
   * Called when user changes currency or theme dropdown.
   * Sends PUT to backend via updatePref from shared context.
   * Shows success or error feedback.
   */
  async function handlePreferenceChange(key, value) {
    setSavingPreference(true);
    setPreferenceError('');
    setPreferenceSuccess('');

    try {
      await updatePref(key, value);
      setPreferenceSuccess(`${key.charAt(0).toUpperCase() + key.slice(1)} updated successfully.`);

      // Clear success message after 3 seconds
      setTimeout(() => setPreferenceSuccess(''), 3000);
    } catch (error) {
      console.error('Preference update failed:', error);

      // Try to get backend error message, fallback to generic
      const backendMessage = error.response?.data?.message;
      setPreferenceError(
          backendMessage || 'Could not update preferences. Please try again.'
      );
    } finally {
      setSavingPreference(false);
    }
  }

  /**
   * triggerDownload
   * Downloads current backup preview JSON as a file.
   */
  function triggerDownload() {
    const blob = new Blob([backupJson], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'neoexpense-backup.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /**
   * handleImport
   * Reads selected JSON backup file.
   * Restores preferences only — expenses need a backend bulk import endpoint.
   */
  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');
    setImporting(true);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // Validate structure
      if (!parsed.expenses || !Array.isArray(parsed.expenses)) {
        throw new Error('Invalid backup: expenses field is missing or not an array.');
      }
      if (!parsed.prefs || typeof parsed.prefs !== 'object') {
        throw new Error('Invalid backup: prefs field is missing.');
      }

      // Restore preferences via backend
      await updatePref('currency', parsed.prefs.currency || 'INR');
      await updatePref('theme', parsed.prefs.theme || 'neon');

      setImportSuccess(
          `Preferences restored from backup. ` +
          `Backup contained ${parsed.expenses.length} expense(s) — ` +
          `expense import requires a backend bulk import endpoint.`
      );
    } catch (err) {
      setImportError(err.message || 'Import failed. Check file format.');
    } finally {
      setImporting(false);
      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  /**
   * resetPreferences
   * Resets currency and theme to defaults after user confirmation.
   * Does NOT delete expenses from the server.
   */
  async function resetPreferences() {
    const confirmed = confirm(
        'Reset currency and theme to defaults (INR / neon)?\n' +
        'Your expenses on the server are not affected.'
    );
    if (!confirmed) return;

    setSavingPreference(true);
    setPreferenceError('');
    setPreferenceSuccess('');

    try {
      await updatePref('currency', 'INR');
      await updatePref('theme', 'neon');
      setPreferenceSuccess('Preferences reset to defaults.');
      setTimeout(() => setPreferenceSuccess(''), 3000);
    } catch (err) {
      console.error('Reset failed:', err);
      setPreferenceError('Could not reset preferences. Please try again.');
    } finally {
      setSavingPreference(false);
    }
  }

  return (
      <div className="settings-page">

        {/* Page header */}
        <div className="settings-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="subtitle">Customize preferences &amp; manage data backup.</p>
          </div>
        </div>

        {/* ── Preferences section ───────────────────────────────── */}
        <section className="settings-section">
          <h2>Preferences</h2>

          <div className="settings-grid">

            {/* Currency selector */}
            <div className="setting-item">
              <label htmlFor="currency-select">Currency</label>
              <select
                  id="currency-select"
                  value={prefs.currency}
                  disabled={savingPreference}
                  onChange={e => handlePreferenceChange('currency', e.target.value)}
              >
                {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <small className="muted">
                Used for all monetary formatting across the app.
              </small>
            </div>

            {/* Theme selector */}
            <div className="setting-item">
              <label htmlFor="theme-select">Theme</label>
              <select
                  id="theme-select"
                  value={prefs.theme}
                  disabled={savingPreference}
                  onChange={e => handlePreferenceChange('theme', e.target.value)}
              >
                {themes.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.label} — {t.description}
                    </option>
                ))}
              </select>
              <small className="muted">
                Changes apply immediately across the whole app.
              </small>
            </div>

          </div>

          {/* Preference feedback */}
          {savingPreference && (
              <div className="muted" style={{ marginTop: '10px', fontSize: '13px' }}>
                Saving preference...
              </div>
          )}
          {preferenceSuccess && (
              <div
                  style={{
                    marginTop: '10px',
                    fontSize: '13px',
                    color: '#6BCB77'
                  }}
              >
                ✓ {preferenceSuccess}
              </div>
          )}
          {preferenceError && (
              <div className="error-msg" style={{ marginTop: '10px' }}>
                ✗ {preferenceError}
              </div>
          )}

          {/* Reset button */}
          <div style={{ marginTop: '16px' }}>
            <button
                className="btn-inline danger"
                onClick={resetPreferences}
                disabled={savingPreference}
            >
              Reset to Defaults
            </button>
          </div>
        </section>

        {/* ── Backup & Restore section ──────────────────────────── */}
        <section className="settings-section">
          <h2>Data Backup &amp; Restore</h2>

          <p className="muted" style={{ marginTop: 0 }}>
            Download a JSON snapshot of your current expenses and preferences.
            Importing a backup restores preferences only.
          </p>

          <div className="backup-actions">
            <button className="btn-accent" onClick={triggerDownload}>
              ⬇ Download Backup JSON
            </button>

            <button
                className="btn-inline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing || savingPreference}
            >
              {importing ? 'Importing...' : '⬆ Import Backup'}
            </button>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleImport}
            />
          </div>

          {/* Import feedback */}
          {importError && (
              <div className="error-msg" style={{ marginTop: '12px' }}>
                ✗ {importError}
              </div>
          )}
          {importSuccess && (
              <div
                  style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#6BCB77'
                  }}
              >
                ✓ {importSuccess}
              </div>
          )}

          {/* Live backup preview */}
          <div style={{ marginTop: '16px' }}>
            <div
                className="muted"
                style={{ fontSize: '11px', marginBottom: '6px' }}
            >
              CURRENT DATA SNAPSHOT
            </div>
            <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="backup-preview"
            >
              {backupJson}
            </motion.pre>
          </div>
        </section>

      </div>
  );
}