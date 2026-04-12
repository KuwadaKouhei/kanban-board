interface Props {
    open: boolean;
    title: string;
    message: string;
    processing?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, processing, onConfirm, onCancel }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={processing}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {processing ? '削除中...' : '削除'}
                    </button>
                </div>
            </div>
        </div>
    );
}
