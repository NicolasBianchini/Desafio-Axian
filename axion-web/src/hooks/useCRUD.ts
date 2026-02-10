import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface UseCRUDOptions {
    endpoint: string;
    onError?: (error: string) => void;
}

export const useCRUD = <T extends { id: number }>({ endpoint, onError }: UseCRUDOptions) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get(endpoint);
            setItems(response.data.data || response.data);
        } catch (err: unknown) {
            const errorMessage = (err as ApiError).response?.data?.message || `Erro ao carregar itens`;
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [endpoint, onError]);

    const createItem = async (data: Partial<T>): Promise<boolean> => {
        try {
            await apiClient.post(endpoint, data);
            await fetchItems();
            return true;
        } catch (err: unknown) {
            const errorMessage = (err as ApiError).response?.data?.message || 'Erro ao criar';
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
        } catch (err: unknown) {
            const errorMessage = (err as ApiError).response?.data?.message || 'Erro ao atualizar';
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
        } catch (err: unknown) {
            const errorMessage = (err as ApiError).response?.data?.message || 'Erro ao excluir';
            alert(errorMessage);
            return false;
        }
    };

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

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
