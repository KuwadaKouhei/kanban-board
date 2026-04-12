export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

// === カンバンボード 型定義 ===

export interface Board {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    columns: Column[];
    columns_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Column {
    id: number;
    board_id: number;
    name: string;
    position: number;
    color: string;
    tasks: Task[];
}

export interface Task {
    id: number;
    column_id: number;
    user_id: number;
    title: string;
    description: string | null;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date: string | null;
    position: number;
    created_at: string;
    updated_at: string;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date: string;
}

export interface TaskOrderPayload {
    id: number;
    column_id: number;
    position: number;
}
