import { Droppable } from '@hello-pangea/dnd';
import { Column, Task } from '@/types';
import TaskCard from './TaskCard';

interface Props {
    column: Column;
    onAddTask: (columnId: number) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
}

export default function KanbanColumn({ column, onAddTask, onEditTask, onDeleteTask }: Props) {
    return (
        <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg flex flex-col max-h-full">
            {/* ヘッダー */}
            <div className="p-3 font-semibold text-sm flex items-center justify-between">
                <span>{column.name}</span>
                <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
                    {column.tasks.length}
                </span>
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
            <Droppable droppableId={`column-${column.id}`}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]
                            ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''}
                        `}
                    >
                        {column.tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
