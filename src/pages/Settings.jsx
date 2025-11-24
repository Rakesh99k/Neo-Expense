import { useEffect, useRef, useState } from 'react';
import { usePrefs } from '../hooks/usePrefs.js';
import { getExpenses, saveExpenses, getPrefs, savePrefs } from '../services/storage.js';
import { motion } from 'framer-motion';

const currencies = ['USD','EUR','GBP','INR','JPY','AUD','CAD'];
const themes = ['neon','light'];

export default function Settings() {
  const { prefs, updatePref } = usePrefs();
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [backupJson, setBackupJson] = useState('');

  useEffect(() => {
    // Apply theme class to document body
    document.body.dataset.theme = prefs.theme;
  }, [prefs.theme]);

  useEffect(() => {
    // Prepare backup preview (include version for future migrations)
    const data = {
      version: 1,
      generatedAt: new Date().toISOString(),
      expenses: getExpenses(),
      prefs: getPrefs()
    };
    setBackupJson(JSON.stringify(data, null, 2));
  }, [prefs]);

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

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.expenses || !Array.isArray(parsed.expenses)) throw new Error('Invalid backup: expenses missing');
      if (!parsed.prefs || typeof parsed.prefs !== 'object') throw new Error('Invalid backup: prefs missing');
      // Optional: future-proof version check
      if (parsed.version && parsed.version > 1) {
        // For now just accept; placeholder for migration logic
      }
      saveExpenses(parsed.expenses);
      savePrefs(parsed.prefs);
      updatePref('currency', parsed.prefs.currency || 'USD');
      updatePref('theme', parsed.prefs.theme || 'neon');
    } catch (err) {
      setImportError(err.message || 'Import failed');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function resetData() {
    if (!confirm('Reset ALL expenses and preferences? This cannot be undone.')) return;
    saveExpenses([]);
    savePrefs({ currency: 'USD', theme: 'neon' });
    updatePref('currency', 'USD');
    updatePref('theme', 'neon');
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="subtitle">Customize preferences & manage data backup.</p>
        </div>
      </div>

      <section className="settings-section">
        <h2>Preferences</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Currency</label>
            <select value={prefs.currency} onChange={e => updatePref('currency', e.target.value)}>
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
            <small className="muted">Used for all monetary formatting.</small>
          </div>
          <div className="setting-item">
            <label>Theme</label>
            <select value={prefs.theme} onChange={e => updatePref('theme', e.target.value)}>
              {themes.map(t => <option key={t}>{t}</option>)}
            </select>
            <small className="muted">Switch between neon and light mode.</small>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Data Backup & Restore</h2>
        <div className="backup-actions">
          <button className="btn-accent" onClick={triggerDownload}>Download Backup JSON</button>
          <button className="btn-inline" onClick={() => fileInputRef.current?.click()} disabled={importing}>{importing ? 'Importing...' : 'Import Backup'}</button>
          <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
          <button className="btn-inline danger" onClick={resetData}>Reset Data</button>
        </div>
        {importError && <div className="error-msg">{importError}</div>}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backup-preview"
        >{backupJson}</motion.pre>
      </section>
    </div>
  );
}
