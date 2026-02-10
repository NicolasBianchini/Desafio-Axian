import { ReactNode, FormEvent } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onSubmit?: (e: FormEvent) => void;
    submitLabel?: string;
    cancelLabel?: string;
    isSubmitting?: boolean;
    error?: string;
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    submitLabel = 'Salvar',
    cancelLabel = 'Cancelar',
    isSubmitting = false,
    error
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button onClick={onClose} className={styles.closeButton}>
                        <FiX size={20} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className={styles.modalForm}>
                    {children}
                    {error && <div className={styles.formError}>{error}</div>}
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            {cancelLabel}
                        </button>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            {isSubmitting ? 'Salvando...' : submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
