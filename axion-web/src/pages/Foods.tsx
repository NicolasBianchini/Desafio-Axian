import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Header } from '../components/Header';
import { useAdminCheck } from '../hooks/useAdminCheck';
import styles from './Foods.module.css';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface Food {
    id: number;
    name: string;
    link: string;
}

type SortOrder = 'asc' | 'desc';

export const Foods = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const { isAdmin } = useAdminCheck();
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [formData, setFormData] = useState({ name: '', link: '' });
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<{ name: string, link: string } | null>(null);

    const fetchFoods = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/foods');
            setFoods(response.data.data || response.data);
        } catch (err: unknown) {
            setError((err as ApiError).response?.data?.message || 'Erro ao carregar comidas');
        } finally {
            setLoading(false);
        }
    };

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedFoods = [...foods].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
    });

    useEffect(() => {
        fetchFoods();
    }, []);

    const openCreateModal = () => {
        setEditingFood(null);
        setFormData({ name: '', link: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (food: Food) => {
        setEditingFood(food);
        setFormData({ name: food.name, link: food.link || '' });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFood(null);
        setFormData({ name: '', link: '' });
        setFormError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.name.trim()) {
            setFormError('Nome é obrigatório');
            return;
        }

        setSaving(true);
        try {
            if (editingFood) {
                await apiClient.put(`/foods/${editingFood.id}`, formData);
            } else {
                await apiClient.post('/foods', formData);
            }
            closeModal();
            fetchFoods();
        } catch (err: unknown) {
            setFormError((err as ApiError).response?.data?.message || 'Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (food: Food) => {
        if (!confirm(`Deseja excluir "${food.name}"?`)) return;

        try {
            await apiClient.delete(`/foods/${food.id}`);
            fetchFoods();
        } catch (err: unknown) {
            alert((err as ApiError).response?.data?.message || 'Erro ao excluir');
        }
    };

    return (
        <div className={styles.container}>
            <Header isAdmin={isAdmin} />

            <main className={styles.main}>
                <div className={styles.titleRow}>
                    <h2 className={styles.title}>Comidas</h2>
                    <div className={styles.actions}>
                        {isAdmin && (
                            <button onClick={openCreateModal} className={styles.addButton}>
                                <FiPlus size={18} /> Novo
                            </button>
                        )}
                        <button onClick={toggleSort} className={styles.sortButton}>
                            {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                        </button>
                    </div>
                </div>

                {loading && <div className={styles.loading}>Carregando...</div>}

                {error && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>{error}</p>
                        <button onClick={fetchFoods} className={styles.retryButton}>
                            Tentar novamente
                        </button>
                    </div>
                )}

                {!loading && !error && foods.length === 0 && (
                    <div className={styles.empty}>Nenhuma comida encontrada</div>
                )}

                {!loading && !error && sortedFoods.length > 0 && (
                    <div className={styles.grid}>
                        {sortedFoods.map((food) => (
                            <div
                                key={food.id}
                                className={styles.card}
                                onClick={() => food.link && setPreviewImage(food)}
                            >
                                {isAdmin && (
                                    <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => openEditModal(food)} className={styles.cardAction}>
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(food)} className={styles.cardActionDelete}>
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                )}
                                {food.link && (
                                    <div className={styles.cardImageWrapper}>
                                        <img
                                            src={food.link}
                                            alt={food.name}
                                            className={styles.cardImage}
                                        />
                                    </div>
                                )}
                                <h3 className={styles.cardTitle}>{food.name}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {previewImage && (
                    <div className={styles.lightboxOverlay} onClick={() => setPreviewImage(null)}>
                        <button className={styles.lightboxClose} onClick={() => setPreviewImage(null)}>
                            <FiX size={24} />
                        </button>
                        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                            <img src={previewImage.link} alt={previewImage.name} className={styles.lightboxImage} />
                            <p className={styles.lightboxCaption}>{previewImage.name}</p>
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3>{editingFood ? 'Editar Comida' : 'Nova Comida'}</h3>
                                <button onClick={closeModal} className={styles.closeButton}>
                                    <FiX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className={styles.modalForm}>
                                <div className={styles.inputGroup}>
                                    <label>Nome *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={styles.input}
                                        placeholder="Nome da comida"
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>URL da Imagem</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className={styles.input}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                    />
                                </div>
                                {formError && <div className={styles.formError}>{formError}</div>}
                                <div className={styles.modalActions}>
                                    <button type="button" onClick={closeModal} className={styles.cancelButton}>
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={saving} className={styles.submitButton}>
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
