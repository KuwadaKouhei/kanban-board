const config = {
    low:    { label: '低',   className: 'bg-blue-100 text-blue-800' },
    medium: { label: '中',   className: 'bg-yellow-100 text-yellow-800' },
    high:   { label: '高',   className: 'bg-orange-100 text-orange-800' },
    urgent: { label: '緊急', className: 'bg-red-100 text-red-800' },
};

export default function PriorityBadge({ priority }: { priority: keyof typeof config }) {
    const { label, className } = config[priority];
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${className}`}>
            {label}
        </span>
    );
}
