export default function DueDateBadge({ date }: { date: string | null }) {
    if (!date) return null;

    const due = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isOverdue = due < today;
    const isSoon = !isOverdue && (due.getTime() - today.getTime()) <= 3 * 86400000;

    const color = isOverdue
        ? 'text-red-600'
        : isSoon
          ? 'text-orange-600'
          : 'text-gray-500';

    return (
        <span className={`text-xs ${color}`}>
            {due.toLocaleDateString('ja-JP')}
        </span>
    );
}
