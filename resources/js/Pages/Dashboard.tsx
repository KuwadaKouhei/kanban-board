import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Board } from '@/types';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function Dashboard({ boards: initialBoards }: { boards: Board[] }) {
    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [showCreate, setShowCreate] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);

    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ name: '', description: '' });

    // === ドラッグ&ドロップ（axios Ajax + async/await + try-catch） ===
    const handleDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.index === destination.index) return;

        // ロールバック用に現在の状態を保持
        const previousBoards = [...boards];

        // 楽観的 UI 更新
        const newBoards = [...boards];
        const [moved] = newBoards.splice(source.index, 1);
        newBoards.splice(destination.index, 0, moved);
        setBoards(newBoards);

        // Ajax でサーバーに送信（async/await + try-catch）
        try {
            const payload = newBoards.map((board, idx) => ({
                id: board.id,
                position: idx,
            }));
            await axios.put('/boards-reorder', { boards: payload });
        } catch (error) {
            // 失敗 → UI ロールバック
            setBoards(previousBoards);
        }
    };

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        createForm.post('/boards', {
            onSuccess: () => {
                createForm.reset();
                setShowCreate(false);
            },
        });
    };

    const handleEdit = (e: FormEvent) => {
        e.preventDefault();
        if (!editingBoard) return;
        editForm.put(`/boards/${editingBoard.id}`, {
            onSuccess: () => setEditingBoard(null),
        });
    };

    const handleDelete = () => {
        if (!deletingBoard) return;
        router.delete(`/boards/${deletingBoard.id}`, {
            onSuccess: () => setDeletingBoard(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">マイボード</h2>}
        >
            <Head title="ダッシュボード" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="mb-6 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            ドラッグ&ドロップでボードの順番を入れ替えられます
                        </p>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            + 新規ボード作成
                        </button>
                    </div>

                    {boards.length === 0 ? (
                        <p className="text-center text-gray-500 py-12">
                            まだボードがありません。新しいボードを作成しましょう。
                        </p>
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="boards" direction="horizontal">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                    >
                                        {boards.map((board, index) => (
                                            <Draggable
                                                key={board.id}
                                                draggableId={`board-${board.id}`}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`rounded-lg bg-white p-6 shadow cursor-grab
                                                            hover:shadow-md transition-shadow
                                                            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-300' : ''}
                                                        `}
                                                        onClick={() => {
                                                            if (!snapshot.isDragging) {
                                                                router.visit(`/boards/${board.id}`);
                                                            }
                                                        }}
                                                    >
                                                        <h3 className="text-lg font-bold mb-2">{board.name}</h3>
                                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                                            {board.description || '説明なし'}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mb-4">
                                                            カラム数: {board.columns_count ?? 0}
                                                        </p>
                                                        <div
                                                            className="flex gap-2"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    editForm.setData({
                                                                        name: board.name,
                                                                        description: board.description ?? '',
                                                                    });
                                                                    setEditingBoard(board);
                                                                }}
                                                                className="text-sm text-indigo-600 hover:underline"
                                                            >
                                                                編集
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingBoard(board)}
                                                                className="text-sm text-red-600 hover:underline"
                                                            >
                                                                削除
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>
            </div>

            {/* 作成モーダル */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">新規ボード作成</h3>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">ボード名 *</label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{createForm.errors.name}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">説明</label>
                                <textarea
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreate(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                                >
                                    作成
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 編集モーダル */}
            {editingBoard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">ボード編集</h3>
                        <form onSubmit={handleEdit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">ボード名 *</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">説明</label>
                                <textarea
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingBoard(null)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                                >
                                    保存
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 削除確認 */}
            <ConfirmDialog
                open={!!deletingBoard}
                title="ボード削除"
                message={`「${deletingBoard?.name}」を削除しますか？配下のカラム・タスクもすべて削除されます。`}
                onConfirm={handleDelete}
                onCancel={() => setDeletingBoard(null)}
            />
        </AuthenticatedLayout>
    );
}
