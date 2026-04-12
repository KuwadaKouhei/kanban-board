import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Column, Task } from '@/types';
import { useState } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';

const PRESET_COLORS = [
    '#6B7280', '#EF4444', '#F97316', '#EAB308',
    '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899',
];

interface Props {
    column: Column;
    index: number;
    onAddTask: (columnId: number) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
    onDeleteColumn: (column: Column) => void;
}

export default function KanbanColumn({ column, index, onAddTask, onEditTask, onDeleteTask, onDeleteColumn }: Props) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useState(column.color || '#6B7280');

    const handleColorChange = async (newColor: string) => {
        const previousColor = color;
        setColor(newColor);
        setShowColorPicker(false);

        try {
            await axios.put(`/columns/${column.id}`, {
                name: column.name,
                color: newColor,
            });
        } catch {
            setColor(previousColor);
        }
    };

    return (
        <Draggable draggableId={`column-${column.id}`} index={index}>
            {(columnProvided, columnSnapshot) => (
                <div
                    ref={columnProvided.innerRef}
                    {...columnProvided.draggableProps}
                    className={`flex-shrink-0 w-80 bg-gray-100 rounded-lg flex flex-col max-h-full
                        ${columnSnapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-300 opacity-90' : ''}
                    `}
                >
                    {/* カラーバー（ドラッグハンドル） */}
                    <div
                        {...columnProvided.dragHandleProps}
                        className="h-3 rounded-t-lg cursor-grab active:cursor-grabbing hover:h-4 transition-all"
                        style={{ backgroundColor: color }}
                        title="ドラッグしてカラムを並び替え"
                    />

                    {/* ヘッダー */}
                    <div className="p-3 font-semibold text-sm flex items-center justify-between relative">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                style={{ backgroundColor: color }}
                                title="色を変更"
                            />
                            <span>{column.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
                                {column.tasks.length}
                            </span>
                            <button
                                onClick={() => onDeleteColumn(column)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="カラムを削除"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* カラーピッカー */}
                        {showColorPicker && (
                            <div className="absolute top-10 left-0 z-10 bg-white rounded-lg shadow-lg border p-2 flex gap-1 flex-wrap w-40">
                                {PRESET_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => handleColorChange(c)}
                                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110
                                            ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}
                                        `}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* タスク追加ボタン */}
                    <div className="px-3 pb-2">
                        <button
                            onClick={() => onAddTask(column.id)}
                            className="w-full text-sm text-gray-500 border-2 border-dashed
                                       border-gray-300 rounded py-1 hover:border-indigo-400
                                       hover:text-indigo-600 transition-colors"
                        >
                            + タスク追加
                        </button>
                    </div>

                    {/* カードリスト（Droppable） */}
                    <Droppable droppableId={`column-${column.id}`} type="TASK">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]
                                    ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''}
                                `}
                            >
                                {column.tasks.map((task, taskIndex) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={taskIndex}
                                        onEdit={onEditTask}
                                        onDelete={onDeleteTask}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
}
