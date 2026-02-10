import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface UseCRUDOptions<T> {
    endpoint: string;
    onError?: (error: string) => void;
}

export const useCRUD = <T extends { id: number }>({ endpoint, onError }: UseCRUDOptions<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get(endpoint);
            setItems(response.data.data || response.data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || `Erro ao carregar itens`;
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (data: Partial<T>): Promise<boolean> => {
        try {
            await apiClient.post(endpoint, data);
            await fetchItems();
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao criar';
            setError(errorMessage);
            onError?.(errorMessage);
            return false;
        }
    };

    const updateItem = async (id: number, data: Partial<T>): Promise<boolean> => {
        try {
            await apiClient.put(`${endpoint}/${id}`, data);
            await fetchItems();
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao atualizar';
            setError(errorMessage);
            onError?.(errorMessage);
            return false;
        }
    };

    const deleteItem = async (id: number, confirmMessage?: string): Promise<boolean> => {
        if (confirmMessage && !confirm(confirmMessage)) {
            return false;
        }

        try {
            await apiClient.delete(`${endpoint}/${id}`);
            await fetchItems();
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao excluir';
            alert(errorMessage);
            return false;
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return {
        items,
        loading,
        error,
        fetchItems,
        createItem,
        updateItem,
        deleteItem
    };
};
