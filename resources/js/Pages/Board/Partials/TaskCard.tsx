import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/types';
import PriorityBadge from '@/Components/PriorityBadge';
import DueDateBadge from '@/Components/DueDateBadge';

interface Props {
    task: Task;
    index: number;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

export default function TaskCard({ task, index, onEdit, onDelete }: Props) {
    return (
        <Draggable draggableId={`task-${task.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`rounded-lg bg-white p-3 shadow-sm border
                        ${snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-300' : ''}
                    `}
                >
                    <h4 className="font-medium text-sm mb-1">{task.title}</h4>

                    {task.description && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            <DueDateBadge date={task.due_date} />
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(task)}
                                className="text-xs text-gray-400 hover:text-indigo-600"
                            >
                                編集
                            </button>
                            <button
                                onClick={() => onDelete(task)}
                                className="text-xs text-gray-400 hover:text-red-600"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
