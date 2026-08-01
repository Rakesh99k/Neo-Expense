import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * BudgetOnboarding
 * Banner shown on Dashboard when user hasn't set up a budget yet.
 * Dismissible via localStorage.
 */
export default function BudgetOnboarding({ onDismiss }) {
    return (
        <motion.div
            className="budget-onboarding"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <div className="budget-onboarding-icon">
                <IconTarget />
            </div>

            <div className="budget-onboarding-text">
                <div className="budget-onboarding-title">
                    Set your monthly budget
                </div>
                <div className="budget-onboarding-desc">
                    Track your spending against a limit and build savings automatically
                </div>
            </div>

            <div className="budget-onboarding-actions">
                <Link to="/budget" className="budget-onboarding-cta">
                    Set Budget
                    <IconArrow />
                </Link>
                <button
                    className="budget-onboarding-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss"
                >
                    <IconX />
                </button>
            </div>
        </motion.div>
    );
}

function IconTarget() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
        </svg>
    );
}

function IconArrow() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}

function IconX() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}