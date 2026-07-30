import { motion, AnimatePresence } from 'framer-motion';

/**
 * ConfirmModal
 * Reusable confirmation dialog for destructive actions.
 * Props:
 *   isOpen — controls visibility
 *   onClose — closes modal
 *   onConfirm — called when user confirms
 *   title — modal title
 *   message — modal message
 *   confirmLabel — confirm button text (default 'Confirm')
 *   cancelLabel — cancel button text (default 'Cancel')
 *   variant — 'danger' | 'default'
 *   icon — element shown at top of modal
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  icon
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="confirm-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onMouseDown={e => e.stopPropagation()}
          >
            {icon && (
              <div className={`confirm-icon confirm-icon-${variant}`}>
                {icon}
              </div>
            )}
            <h3 className="confirm-title">{title}</h3>
            {message && <p className="confirm-message">{message}</p>}
            <div className="confirm-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`btn-primary ${variant === 'danger' ? 'btn-danger' : ''}`}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}