import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { useRecurring } from '../hooks/useRecurring.js';
import { usePrefs } from '../hooks/usePrefs.js';
import { getCurrencySymbol } from '../utils/format.js';

import RecurringModal from '../components/recurring/RecurringModal.jsx';
import RecurringListItem from '../components/recurring/RecurringListItem.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import FAB from '../components/ui/FAB.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Recurring() {
    const {
        recurring,
        loading,
        error,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        pauseRecurring,
        resumeRecurring
    } = useRecurring();

    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Compute totals
    const totals = useMemo(() => {
        const activeItems = recurring.filter(r => r.active);
        const monthlyTotal = activeItems
            .filter(r => r.frequency === 'MONTHLY')
            .reduce((sum, r) => sum + r.amount, 0);
        const weeklyTotal = activeItems
            .filter(r => r.frequency === 'WEEKLY')
            .reduce((sum, r) => sum + r.amount, 0);
        const yearlyTotal = activeItems
            .filter(r => r.frequency === 'YEARLY')
            .reduce((sum, r) => sum + r.amount, 0);

        // Estimated monthly cost (weekly × 4.33, yearly / 12)
        const estMonthly = monthlyTotal + (weeklyTotal * 4.33) + (yearlyTotal / 12);

        return {
            activeCount: activeItems.length,
            estMonthly: Math.round(estMonthly)
        };
    }, [recurring]);

    async function handleAdd(data) {
        try {
            await addRecurring(data);
            toast.success('Recurring expense created');
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to create');
        }
    }

    async function handleUpdate(data) {
        try {
            await updateRecurring(editing.id, data);
            toast.success('Recurring expense updated');
            setModalOpen(false);
            setEditing(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update');
        }
    }

    async function handleDelete(id) {
        try {
            await deleteRecurring(id);
            toast.success('Recurring expense deleted');
        } catch (err) {
            toast.error('Failed to delete');
        }
    }

    async function handleTogglePause(item) {
        try {
            if (item.active) {
                await pauseRecurring(item.id);
                toast.success(`Paused ${item.title}`);
            } else {
                await resumeRecurring(item.id);
                toast.success(`Resumed ${item.title}`);
            }
        } catch (err) {
            toast.error('Failed to toggle');
        }
    }

    if (loading) {
        return (
            <div className="recurring-page">
                <LoadingSpinner fullPage message="Loading recurring expenses..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="recurring-page">
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <div className="empty-state-title">Something went wrong</div>
                    <div className="empty-state-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="recurring-page">

            {/* Header */}
            <motion.div
                className="recurring-page-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="page-title">Recurring Expenses</h1>
                    <p className="page-subtitle">
                        Auto-add expenses on a schedule
                    </p>
                </div>
                <div className="recurring-page-action-desktop">
                    <GradientButton
                        onClick={() => { setEditing(null); setModalOpen(true); }}
                        icon={<IconPlus />}
                    >
                        Add Recurring
                    </GradientButton>
                </div>
            </motion.div>

            {/* Summary cards */}
            {recurring.length > 0 && (
                <div className="recurring-summary-row">
                    <motion.div
                        className="recurring-summary-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="recurring-summary-label">Active</div>
                        <div className="recurring-summary-value">
                            {totals.activeCount}
                        </div>
                    </motion.div>

                    <motion.div
                        className="recurring-summary-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <div className="recurring-summary-label">Est. Monthly Cost</div>
                        <div className="recurring-summary-value">
                            {symbol}{totals.estMonthly.toLocaleString('en-IN')}
                        </div>
                    </motion.div>

                    <motion.div
                        className="recurring-summary-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="recurring-summary-label">Est. Yearly Cost</div>
                        <div className="recurring-summary-value">
                            {symbol}{(totals.estMonthly * 12).toLocaleString('en-IN')}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Empty state */}
            {recurring.length === 0 && (
                <motion.div
                    className="empty-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="empty-state-icon">🔄</div>
                    <div className="empty-state-title">No recurring expenses</div>
                    <div className="empty-state-message">
                        Set up subscriptions like Netflix, rent, or gym membership
                        to auto-add them on schedule.
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <GradientButton
                            onClick={() => { setEditing(null); setModalOpen(true); }}
                            icon={<IconPlus />}
                        >
                            Add Your First
                        </GradientButton>
                    </div>
                </motion.div>
            )}

            {/* List */}
            {recurring.length > 0 && (
                <div className="recurring-list">
                    <AnimatePresence initial={false}>
                        {recurring.map(item => (
                            <RecurringListItem
                                key={item.id}
                                item={item}
                                onEdit={() => { setEditing(item); setModalOpen(true); }}
                                onDelete={() => setConfirmDelete(item)}
                                onTogglePause={() => handleTogglePause(item)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Info tip */}
            {recurring.length > 0 && (
                <motion.div
                    className="recurring-tip"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="recurring-tip-icon">ℹ️</span>
                    <div>
                        <strong>How it works:</strong> Expenses are auto-added on their due date.
                        Pause an item if you cancel a subscription. Delete removes it permanently.
                    </div>
                </motion.div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {modalOpen && (
                    <RecurringModal
                        initialData={editing}
                        onClose={() => { setModalOpen(false); setEditing(null); }}
                        onSubmit={data => editing ? handleUpdate(data) : handleAdd(data)}
                    />
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete.id)}
                title="Delete Recurring Expense"
                message={`Delete "${confirmDelete?.title}"? Existing auto-generated expenses will remain.`}
                confirmLabel="Delete"
                variant="danger"
            />

            {/* Mobile FAB */}
            <FAB
                onClick={() => { setEditing(null); setModalOpen(true); }}
                label="Add recurring"
            />
        </div>
    );
}

function IconPlus() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}