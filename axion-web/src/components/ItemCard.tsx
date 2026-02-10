import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './ItemCard.module.css';

interface ItemCardProps {
    id: number;
    name: string;
    imageUrl?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
    showActions?: boolean;
}

export const ItemCard = ({
    name,
    imageUrl,
    onEdit,
    onDelete,
    onClick,
    showActions = false
}: ItemCardProps) => {
    const cardStyle = imageUrl
        ? {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }
        : {};

    return (
        <div
            className={styles.card}
            onClick={onClick}
            style={cardStyle}
        >
            {showActions && (onEdit || onDelete) && (
                <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                    {onEdit && (
                        <button onClick={onEdit} className={styles.cardAction}>
                            <FiEdit2 size={14} />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={onDelete} className={styles.cardActionDelete}>
                            <FiTrash2 size={14} />
                        </button>
                    )}
                </div>
            )}
            <h3 className={styles.cardTitle}>{name}</h3>
        </div>
    );
};
