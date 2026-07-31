import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { usePrefs } from '../hooks/usePrefs.js';
import { useExpenses } from '../hooks/useExpenses.js';
import { useUser } from '../context/UserContext.jsx';
import { CURRENCIES, THEMES } from '../constants/index.js';

import GradientButton from '../components/ui/GradientButton.jsx';
import UserAvatar from '../components/ui/UserAvatar.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';

export default function Settings() {
  const { prefs, updatePref } = usePrefs();
  const { expenses } = useExpenses();
  const { user } = useUser();

  const [savingPref, setSavingPref] = useState(false);
  const [importing, setImporting] = useState(false);
  const [backupJson, setBackupJson] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.dataset.theme = prefs.theme || 'neon-noir';
  }, [prefs.theme]);

  useEffect(() => {
    const data = {
      version: 1,
      generatedAt: new Date().toISOString(),
      expenses,
      prefs
    };
    setBackupJson(JSON.stringify(data, null, 2));
  }, [prefs, expenses]);

  async function handleChange(key, value) {
    setSavingPref(true);
    try {
      await updatePref(key, value);
      toast.success(
        `${key.charAt(0).toUpperCase() + key.slice(1)} updated`
      );
    } catch (err) {
      console.error('Preference update failed:', err);
      toast.error('Could not save preference');
    } finally {
      setSavingPref(false);
    }
  }

  function downloadBackup() {
    try {
      const blob = new Blob([backupJson], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `neoexpense-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast.success('Backup downloaded');
    } catch (err) {
      console.error('Download failed', err);
      toast.error('Backup download failed');
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.expenses || !Array.isArray(parsed.expenses)) {
        throw new Error('Invalid backup: expenses missing');
      }
      if (!parsed.prefs || typeof parsed.prefs !== 'object') {
        throw new Error('Invalid backup: prefs missing');
      }

      await updatePref('currency', parsed.prefs.currency || 'INR');
      await updatePref('theme', parsed.prefs.theme || 'neon-noir');

      toast.success(
        `Preferences restored. Backup contained ${parsed.expenses.length} expense(s).`,
        { duration: 6000 }
      );
    } catch (err) {
      console.error('Import failed', err);
      toast.error(err.message || 'Import failed');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function resetPreferences() {
    setSavingPref(true);
    try {
      await updatePref('currency', 'INR');
      await updatePref('theme', 'neon-noir');
      toast.success('Preferences reset to defaults');
    } catch (err) {
      toast.error('Reset failed');
    } finally {
      setSavingPref(false);
    }
  }

  return (
    <div className="settings-page">

      {/* Header */}
      <motion.div
        className="settings-page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Customize preferences and manage your data
          </p>
        </div>
      </motion.div>

      {/* Profile section (read-only) */}
      {user && (
        <motion.section
          className="settings-section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="settings-section-header">
            <div>
              <h2>Profile</h2>
              <p className="settings-section-sub">Your account information</p>
            </div>
          </div>

          <div className="profile-card">
            <UserAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              size={64}
            />
            <div className="profile-info">
              <div className="profile-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="profile-email">{user.email}</div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Preferences */}
      <motion.section
        className="settings-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="settings-section-header">
          <div>
            <h2>Preferences</h2>
            <p className="settings-section-sub">Customize how the app looks and feels</p>
          </div>
        </div>

        <div className="settings-grid">
          {/* Currency */}
          <div className="setting-item">
            <label className="setting-label">Currency</label>
            <select
              className="input-field"
              value={prefs.currency}
              disabled={savingPref}
              onChange={e => handleChange('currency', e.target.value)}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} — {c.label}
                </option>
              ))}
            </select>
            <p className="setting-hint">
              Used for all monetary formatting across the app
            </p>
          </div>

          {/* Theme */}
          <div className="setting-item">
            <label className="setting-label">Theme</label>
            <div className="theme-grid">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  className={`theme-option ${
                    prefs.theme === theme.id ? 'active' : ''
                  }`}
                  disabled={savingPref}
                  onClick={() => handleChange('theme', theme.id)}
                  type="button"
                >
                  <div
                    className="theme-option-swatch"
                    style={{
                      background: theme.preview.bg,
                      border: `2px solid ${theme.preview.accent}`
                    }}
                  >
                    <span
                      className="theme-option-dot"
                      style={{ background: theme.preview.accent }}
                    />
                  </div>
                  <div className="theme-option-info">
                    <div className="theme-option-name">
                      <span>{theme.icon}</span>
                      <span>{theme.label}</span>
                    </div>
                    <div className="theme-option-desc">{theme.description}</div>
                  </div>
                  {prefs.theme === theme.id && (
                    <span className="theme-option-check">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-section-footer">
          <button
            className="btn-secondary"
            onClick={() => setResetOpen(true)}
            disabled={savingPref}
          >
            Reset to Defaults
          </button>
        </div>
      </motion.section>

      {/* Backup & Restore */}
      <motion.section
        className="settings-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="settings-section-header">
          <div>
            <h2>Data Backup &amp; Restore</h2>
            <p className="settings-section-sub">
              Download or restore your preferences (expenses stay on server)
            </p>
          </div>
        </div>

        <div className="backup-actions">
          <GradientButton
            onClick={downloadBackup}
            icon={<IconDownload />}
          >
            Download Backup
          </GradientButton>
          <button
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? 'Importing...' : 'Import Backup'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>

        <div className="backup-preview-wrapper">
          <div className="backup-preview-header">
            <span className="backup-preview-label">Current Data Snapshot</span>
            <span className="backup-preview-count">
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
            </span>
          </div>
          <pre className="backup-preview">{backupJson}</pre>
        </div>
      </motion.section>

      {/* Reset confirmation */}
      <ConfirmModal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={resetPreferences}
        title="Reset Preferences"
        message="This will reset your currency to INR and theme to Neon Noir. Your expenses are not affected. Continue?"
        confirmLabel="Reset"
        variant="danger"
      />
    </div>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
}