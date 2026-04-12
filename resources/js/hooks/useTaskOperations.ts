import { router } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { TaskFormData, TaskOrderPayload } from '@/types';

export function useTaskOperations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * タスク作成（async/await + Inertia を Promise 化）
     */
    const createTask = useCallback(
        async (columnId: number, data: TaskFormData): Promise<void> => {
            setLoading(true);
            setError(null);
            try {
                await new Promise<void>((resolve, reject) => {
                    router.post(`/columns/${columnId}/tasks`, data as any, {
                        preserveScroll: true,
                        onSuccess: () => resolve(),
                        onError: (errors) =>
                            reject(new Error(Object.values(errors).flat().join(', '))),
                    });
                });
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'タスクの作成に失敗しました';
                setError(msg);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    /**
     * タスク更新（async/await + Inertia を Promise 化）
     */
    const updateTask = useCallback(
        async (taskId: number, data: TaskFormData): Promise<void> => {
            setLoading(true);
            setError(null);
            try {
                await new Promise<void>((resolve, reject) => {
                    router.put(`/tasks/${taskId}`, data as any, {
                        preserveScroll: true,
                        onSuccess: () => resolve(),
                        onError: (errors) =>
                            reject(new Error(Object.values(errors).flat().join(', '))),
                    });
                });
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'タスクの更新に失敗しました';
                setError(msg);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    /**
     * タスク削除（async/await + Inertia を Promise 化）
     */
    const deleteTask = useCallback(async (taskId: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await new Promise<void>((resolve, reject) => {
                router.delete(`/tasks/${taskId}`, {
                    preserveScroll: true,
                    onSuccess: () => resolve(),
                    onError: (errors) =>
                        reject(new Error(Object.values(errors).flat().join(', '))),
                });
            });
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'タスクの削除に失敗しました';
            setError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * タスク並び替え（async/await + axios 直接 Ajax 通信）
     */
    const reorderTasks = useCallback(
        async (tasks: TaskOrderPayload[]): Promise<void> => {
            setLoading(true);
            setError(null);
            try {
                await axios.put('/tasks-reorder', { tasks });
            } catch (e) {
                const msg = axios.isAxiosError(e)
                    ? e.response?.data?.error ?? 'ネットワークエラー'
                    : '並び替えに失敗しました';
                setError(msg);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { loading, error, createTask, updateTask, deleteTask, reorderTasks };
}
