import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Board, Column, Task, TaskOrderPayload } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import KanbanColumn from './Partials/KanbanColumn';
import CreateTaskModal from './Partials/CreateTaskModal';
import EditTaskModal from './Partials/EditTaskModal';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useTaskOperations } from '@/hooks/useTaskOperations';

export default function Show({ board }: { board: Board }) {
    const [columns, setColumns] = useState<Column[]>(board.columns);

    // Inertia がページ props を更新したら columns state を同期
    useEffect(() => {
        setColumns(board.columns);
    }, [board.columns]);

    const [createColumnId, setCreateColumnId] = useState<number | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [deletingColumn, setDeletingColumn] = useState<Column | null>(null);
    const [showAddColumn, setShowAddColumn] = useState(false);

    const { reorderTasks } = useTaskOperations();

    const columnForm = useForm({ name: '', color: '#6B7280' });

    // === ドラッグ&ドロップ完了ハンドラー（async/await + try-catch） ===
    const handleDragEnd = async (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        // ロールバック用に現在の状態を保持
        const previousColumns = columns.map((c) => ({
            ...c,
            tasks: [...c.tasks],
        }));

        // ローカルで並び替え（楽観的 UI 更新）
        const srcColId = parseInt(source.droppableId.replace('column-', ''));
        const dstColId = parseInt(destination.droppableId.replace('column-', ''));

        const newColumns = columns.map((c) => ({ ...c, tasks: [...c.tasks] }));
        const srcCol = newColumns.find((c) => c.id === srcColId)!;
        const dstCol = newColumns.find((c) => c.id === dstColId)!;

        const [movedTask] = srcCol.tasks.splice(source.index, 1);
        movedTask.column_id = dstColId;
        dstCol.tasks.splice(destination.index, 0, movedTask);

        setColumns(newColumns);

        // サーバーへ非同期送信（async/await + try-catch）
        try {
            const payload: TaskOrderPayload[] = [];
            newColumns.forEach((col) => {
                col.tasks.forEach((task, idx) => {
                    payload.push({
                        id: task.id,
                        column_id: col.id,
                        position: idx,
                    });
                });
            });
            await reorderTasks(payload);
        } catch {
            // 失敗 → UI ロールバック
            setColumns(previousColumns);
        }
    };

    // カラム追加
    const handleAddColumn = (e: FormEvent) => {
        e.preventDefault();
        columnForm.post(`/boards/${board.id}/columns`, {
            preserveScroll: true,
            onSuccess: () => {
                columnForm.reset();
                setShowAddColumn(false);
            },
        });
    };

    // タスク削除
    const handleDeleteTask = () => {
        if (!deletingTask) return;
        router.delete(`/tasks/${deletingTask.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingTask(null),
        });
    };

    // カラム削除
    const handleDeleteColumn = () => {
        if (!deletingColumn) return;
        router.delete(`/columns/${deletingColumn.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingColumn(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.visit('/dashboard')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &larr; 戻る
                    </button>
                    <h2 className="text-xl font-semibold">{board.name}</h2>
                    <button
                        onClick={() => setShowAddColumn(true)}
                        className="ml-auto rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                    >
                        + カラム追加
                    </button>
                </div>
            }
        >
            <Head title={board.name} />

            <div className="h-[calc(100vh-8rem)] overflow-x-auto">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 p-6 h-full items-start">
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                onAddTask={(colId) => setCreateColumnId(colId)}
                                onEditTask={(task) => setEditingTask(task)}
                                onDeleteTask={(task) => setDeletingTask(task)}
                                onDeleteColumn={(col) => setDeletingColumn(col)}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* タスク作成モーダル */}
            <CreateTaskModal
                columnId={createColumnId ?? 0}
                open={createColumnId !== null}
                onClose={() => setCreateColumnId(null)}
            />

            {/* タスク編集モーダル */}
            <EditTaskModal
                task={editingTask}
                open={editingTask !== null}
                onClose={() => setEditingTask(null)}
            />

            {/* タスク削除確認 */}
            <ConfirmDialog
                open={!!deletingTask}
                title="タスク削除"
                message={`「${deletingTask?.title}」を削除しますか？`}
                onConfirm={handleDeleteTask}
                onCancel={() => setDeletingTask(null)}
            />

            {/* カラム削除確認 */}
            <ConfirmDialog
                open={!!deletingColumn}
                title="カラム削除"
                message={`「${deletingColumn?.name}」を削除しますか？カラム内のタスクもすべて削除されます。`}
                onConfirm={handleDeleteColumn}
                onCancel={() => setDeletingColumn(null)}
            />

            {/* カラム追加モーダル */}
            {showAddColumn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">カラム追加</h3>
                        <form onSubmit={handleAddColumn}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    カラム名 *
                                </label>
                                <input
                                    type="text"
                                    value={columnForm.data.name}
                                    onChange={(e) => columnForm.setData('name', e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    カラーを選択
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#6B7280','#EF4444','#F97316','#EAB308','#22C55E','#3B82F6','#8B5CF6','#EC4899'].map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => columnForm.setData('color', c)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                                                ${columnForm.data.color === c ? 'border-gray-800 scale-110' : 'border-transparent'}
                                            `}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddColumn(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={columnForm.processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                                >
                                    追加
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
