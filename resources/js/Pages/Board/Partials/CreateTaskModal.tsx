import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    columnId: number;
    open: boolean;
    onClose: () => void;
}

export default function CreateTaskModal({ columnId, open, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        priority: 'medium' as const,
        due_date: '',
    });

    if (!open) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/columns/${columnId}/tasks`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">タスク作成</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">タイトル *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">説明</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">優先度 *</label>
                            <select
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value as any)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="low">低</option>
                                <option value="medium">中</option>
                                <option value="high">高</option>
                                <option value="urgent">緊急</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">期限日</label>
                            <input
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.due_date && (
                                <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                        >
                            作成
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
