import { FiX } from 'react-icons/fi';
import styles from './Lightbox.module.css';

interface LightboxProps {
    isOpen: boolean;
    imageUrl: string;
    caption?: string;
    onClose: () => void;
}

export const Lightbox = ({ isOpen, imageUrl, caption, onClose }: LightboxProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.lightboxOverlay} onClick={onClose}>
            <button className={styles.lightboxClose} onClick={onClose}>
                <FiX size={24} />
            </button>
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt={caption || 'Preview'} className={styles.lightboxImage} />
                {caption && <p className={styles.lightboxCaption}>{caption}</p>}
            </div>
        </div>
    );
};
