/**
 * Settings
 * Preference management (currency, theme) and local backup/restore of app data.
 * - Generates a backup JSON and supports importing it to restore state.
 * - Applies theme via body[data-theme] attribute.
 */
import { useEffect, useRef, useState } from 'react'; // local state, refs, effects
import { usePrefs } from '../hooks/usePrefs.js'; // prefs hook
import { getExpenses, saveExpenses, getPrefs, savePrefs } from '../services/storage.js'; // local storage helpers
import { motion } from 'framer-motion'; // animated preview

const currencies = ['USD','EUR','GBP','INR','JPY','AUD','CAD']; // supported currency codes
const themes = ['neon','light','dark-castle']; // available themes

export default function Settings() { // preferences and backup/restore page
  const { prefs, updatePref } = usePrefs(); // current prefs and updater
  const [importError, setImportError] = useState(''); // error message for import
  const fileInputRef = useRef(null); // hidden file input ref
  const [importing, setImporting] = useState(false); // import busy flag
  const [backupJson, setBackupJson] = useState(''); // preview string of backup

  useEffect(() => {
    // Apply theme class to document body
    document.body.dataset.theme = prefs.theme; // CSS picks palette via data attribute
  }, [prefs.theme]);

  useEffect(() => {
    // Prepare backup preview (include version for future migrations)
    const data = {
      version: 1, // backup format version
      generatedAt: new Date().toISOString(), // when generated
      expenses: getExpenses(), // current expense data
      prefs: getPrefs() // current prefs
    };
    setBackupJson(JSON.stringify(data, null, 2)); // pretty-printed preview
  }, [prefs]); // regenerate when prefs change

  function triggerDownload() { // download current backup preview as JSON
    const blob = new Blob([backupJson], { type: 'application/json' }); // create blob
    const a = document.createElement('a'); // temporary anchor
    a.href = URL.createObjectURL(blob); // object URL
    a.download = 'neoexpense-backup.json'; // filename
    document.body.appendChild(a); // attach to DOM
    a.click(); // start download
    a.remove(); // cleanup element
    setTimeout(() => URL.revokeObjectURL(a.href), 2000); // revoke URL later
  }

  async function handleImport(e) { // restore from selected backup file
    const file = e.target.files?.[0]; // first selected file
    if (!file) return; // nothing to do
    setImportError(''); // clear previous error
    setImporting(true); // set busy flag
    try {
      const text = await file.text(); // read file as text
      const parsed = JSON.parse(text); // parse JSON
      if (!parsed.expenses || !Array.isArray(parsed.expenses)) throw new Error('Invalid backup: expenses missing'); // validate
      if (!parsed.prefs || typeof parsed.prefs !== 'object') throw new Error('Invalid backup: prefs missing'); // validate
      // Optional: future-proof version check
      if (parsed.version && parsed.version > 1) {
        // For now just accept; placeholder for migration logic
      }
      saveExpenses(parsed.expenses); // save expenses to storage
      savePrefs(parsed.prefs); // save prefs to storage
      updatePref('currency', parsed.prefs.currency || 'USD'); // propagate currency
      updatePref('theme', parsed.prefs.theme || 'neon'); // propagate theme
    } catch (err) {
      setImportError(err.message || 'Import failed'); // show error
    } finally {
      setImporting(false); // clear busy flag
      if (fileInputRef.current) fileInputRef.current.value = ''; // reset file input
    }
  }

  function resetData() { // wipe local data and reset prefs
    if (!confirm('Reset ALL expenses and preferences? This cannot be undone.')) return; // confirmation
    saveExpenses([]); // clear expenses
    savePrefs({ currency: 'USD', theme: 'neon' }); // reset prefs in storage
    updatePref('currency', 'USD'); // reflect in app state
    updatePref('theme', 'neon'); // reflect in app state
  }

  return (
    <div className="settings-page"> {/* page container */}
      <div className="settings-header"> {/* title */}
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="subtitle">Customize preferences & manage data backup.</p>
        </div>
      </div>

      <section className="settings-section"> {/* preferences section */}
        <h2>Preferences</h2>
        <div className="settings-grid"> {/* grid of fields */}
          <div className="setting-item"> {/* currency */}
            <label>Currency</label>
            <select value={prefs.currency} onChange={e => updatePref('currency', e.target.value)}>
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
            <small className="muted">Used for all monetary formatting.</small>
          </div>
          <div className="setting-item"> {/* theme */}
            <label>Theme</label>
            <select value={prefs.theme} onChange={e => updatePref('theme', e.target.value)}>
              {themes.map(t => <option key={t}>{t}</option>)}
            </select>
            <small className="muted">Switch between neon, light, and dark castle mode.</small>
          </div>
        </div>
      </section>

      <section className="settings-section"> {/* backup/restore */}
        <h2>Data Backup & Restore</h2>
        <div className="backup-actions"> {/* buttons */}
          <button className="btn-accent" onClick={triggerDownload}>Download Backup JSON</button>
          <button className="btn-inline" onClick={() => fileInputRef.current?.click()} disabled={importing}>{importing ? 'Importing...' : 'Import Backup'}</button>
          <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
          <button className="btn-inline danger" onClick={resetData}>Reset Data</button>
        </div>
        {importError && <div className="error-msg">{importError}</div>} {/* show import error */}
        <motion.pre
          initial={{ opacity: 0 }} // fade in
          animate={{ opacity: 1 }} // visible
          className="backup-preview" // preview style
        >{backupJson}</motion.pre>
      </section>
    </div>
  );
}
