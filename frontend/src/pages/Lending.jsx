import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import CountUp from 'react-countup';

import { useLending } from '../hooks/useLending.js';
import { usePrefs } from '../hooks/usePrefs.js';
import { getCurrencySymbol } from '../utils/format.js';

import LendingItem from '../components/lending/LendingItem.jsx';
import LendingModal from '../components/lending/LendingModal.jsx';
import PaymentModal from '../components/lending/PaymentModal.jsx';
import GradientButton from '../components/ui/GradientButton.jsx';
import ConfirmModal from '../components/ui/ConfirmModal.jsx';
import FAB from '../components/ui/FAB.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import FilterSelect from '../components/ui/FilterSelect.jsx';

const TABS = [
    { id: 'all', label: 'All' },
    { id: 'lent', label: 'Lent', matchType: 'LENT' },
    { id: 'borrowed', label: 'Borrowed', matchType: 'BORROWED' }
];

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active only' },
    { value: 'settled', label: 'Settled only' }
];

export default function Lending() {
    const {
        lendings,
        summary,
        loading,
        error,
        addLending,
        updateLending,
        deleteLending,
        recordPayment
    } = useLending();

    const { prefs } = usePrefs();
    const symbol = getCurrencySymbol(prefs.currency);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [paymentTarget, setPaymentTarget] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [activeTab, setActiveTab] = useState('all');
    const [statusFilter, setStatusFilter] = useState('');
    const [personFilter, setPersonFilter] = useState('');

    // Filter lendings
    const filtered = useMemo(() => {
        let items = lendings;

        // Tab filter
        const tab = TABS.find(t => t.id === activeTab);
        if (tab?.matchType) {
            items = items.filter(l => l.type === tab.matchType);
        }

        // Status filter
        if (statusFilter === 'active') {
            items = items.filter(l => l.status !== 'SETTLED');
        } else if (statusFilter === 'settled') {
            items = items.filter(l => l.status === 'SETTLED');
        }

        // Person filter
        if (personFilter) {
            items = items.filter(l => l.personName === personFilter);
        }

        return items;
    }, [lendings, activeTab, statusFilter, personFilter]);

    const personOptions = summary.knownPersons.map(name => ({
        value: name,
        label: name
    }));

    async function handleAdd(payload) {
        try {
            await addLending(payload);
            toast.success(
                payload.type === 'LENT'
                    ? `Lent ${symbol}${payload.originalAmount} to ${payload.personName}`
                    : `Borrowed ${symbol}${payload.originalAmount} from ${payload.personName}`
            );
            setModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to save');
        }
    }

    async function handleUpdate(payload) {
        try {
            await updateLending(editing.id, payload);
            toast.success('Updated');
            setModalOpen(false);
            setEditing(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update');
        }
    }

    async function handleDelete(id) {
        try {
            await deleteLending(id);
            toast.success('Deleted');
        } catch (err) {
            toast.error('Failed to delete');
        }
    }

    async function handlePayment(payload) {
        try {
            await recordPayment(paymentTarget.id, payload);
            const wasFullPayment = payload.amount >= paymentTarget.remainingAmount;
            toast.success(
                wasFullPayment
                    ? '🎉 Fully settled!'
                    : `Payment of ${symbol}${payload.amount} recorded`
            );
            setPaymentTarget(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to record payment');
        }
    }

    if (loading) {
        return (
            <div className="lending-page">
                <LoadingSpinner fullPage message="Loading lending data..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="lending-page">
                <div className="empty-state">
                    <div className="empty-state-icon">⚠️</div>
                    <div className="empty-state-title">Something went wrong</div>
                    <div className="empty-state-message">{error}</div>
                </div>
            </div>
        );
    }

    const hasAnyData = lendings.length > 0;

    return (
        <div className="lending-page">

            {/* Header */}
            <motion.div
                className="lending-page-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="page-title">Lending</h1>
                    <p className="page-subtitle">
                        Track money you've lent or borrowed
                    </p>
                </div>
                <div className="lending-page-action-desktop">
                    <GradientButton
                        onClick={() => { setEditing(null); setModalOpen(true); }}
                        icon={<IconPlus />}
                    >
                        New Record
                    </GradientButton>
                </div>
            </motion.div>

            {/* Summary cards */}
            {hasAnyData && (
                <div className="lending-summary-grid">
                    <motion.div
                        className="lending-summary-card lending-summary-lent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="lending-summary-icon">
                            <IconArrowUp />
                        </div>
                        <div>
                            <div className="lending-summary-label">Owed to you</div>
                            <div className="lending-summary-value">
                                {symbol}<CountUp end={summary.owedToYou} duration={1} separator="," decimals={0} preserveValue />
                            </div>
                            <div className="lending-summary-count">
                                {summary.activeLentCount} active
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="lending-summary-card lending-summary-borrowed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <div className="lending-summary-icon">
                            <IconArrowDown />
                        </div>
                        <div>
                            <div className="lending-summary-label">You owe</div>
                            <div className="lending-summary-value">
                                {symbol}<CountUp end={summary.youOwe} duration={1} separator="," decimals={0} preserveValue />
                            </div>
                            <div className="lending-summary-count">
                                {summary.activeBorrowedCount} active
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className={`lending-summary-card lending-summary-net ${
                            summary.netPosition >= 0 ? 'lending-summary-net-positive' : 'lending-summary-net-negative'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="lending-summary-icon">
                            {summary.netPosition >= 0 ? <IconTrendUp /> : <IconTrendDown />}
                        </div>
                        <div>
                            <div className="lending-summary-label">Net position</div>
                            <div className="lending-summary-value">
                                {summary.netPosition >= 0 ? '+' : '-'}
                                {symbol}
                                <CountUp
                                    end={Math.abs(summary.netPosition)}
                                    duration={1}
                                    separator=","
                                    decimals={0}
                                    preserveValue
                                />
                            </div>
                            <div className="lending-summary-count">
                                {summary.netPosition >= 0 ? 'in your favor' : 'you owe more'}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Tabs */}
            {hasAnyData && (
                <div className="lending-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`lending-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Filters */}
            {hasAnyData && (
                <div className="lending-filters">
                    <FilterSelect
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={STATUS_OPTIONS}
                        placeholder="All statuses"
                    />
                    {personOptions.length > 0 && (
                        <FilterSelect
                            value={personFilter}
                            onChange={e => setPersonFilter(e.target.value)}
                            options={personOptions}
                            placeholder="All people"
                        />
                    )}
                    {(statusFilter || personFilter) && (
                        <button
                            className="btn-clear-filters"
                            onClick={() => { setStatusFilter(''); setPersonFilter(''); }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Empty state */}
            {!hasAnyData && (
                <motion.div
                    className="empty-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="empty-state-icon">🤝</div>
                    <div className="empty-state-title">No lending records yet</div>
                    <div className="empty-state-message">
                        Track money you lend to friends or borrow from them.
                        Record partial payments when they return.
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

            {/* Filtered empty */}
            {hasAnyData && filtered.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <div className="empty-state-title">No matching records</div>
                    <div className="empty-state-message">
                        Try adjusting your filters or tab
                    </div>
                </div>
            )}

            {/* List */}
            {filtered.length > 0 && (
                <div className="lending-list">
                    <AnimatePresence initial={false}>
                        {filtered.map(item => (
                            <LendingItem
                                key={item.id}
                                lending={item}
                                onEdit={() => { setEditing(item); setModalOpen(true); }}
                                onDelete={() => setConfirmDelete(item)}
                                onRecordPayment={() => setPaymentTarget(item)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {modalOpen && (
                    <LendingModal
                        initialData={editing}
                        knownPersons={summary.knownPersons}
                        onClose={() => { setModalOpen(false); setEditing(null); }}
                        onSubmit={editing ? handleUpdate : handleAdd}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {paymentTarget && (
                    <PaymentModal
                        lending={paymentTarget}
                        onClose={() => setPaymentTarget(null)}
                        onSubmit={handlePayment}
                    />
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={() => handleDelete(confirmDelete.id)}
                title="Delete Lending Record"
                message={`Delete ${confirmDelete?.type === 'LENT' ? 'money lent to' : 'money borrowed from'} ${confirmDelete?.personName}? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
            />

            {/* Mobile FAB */}
            <FAB
                onClick={() => { setEditing(null); setModalOpen(true); }}
                label="New lending"
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

function IconArrowUp() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    );
}

function IconArrowDown() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
    );
}

function IconTrendUp() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    );
}

function IconTrendDown() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
        </svg>
    );
}