<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Column;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function store(StoreTaskRequest $request, Column $column): RedirectResponse
    {
        try {
            $this->authorize('update', $column->board);

            $maxPosition = $column->tasks()->max('position') ?? -1;

            $column->tasks()->create([
                ...$request->validated(),
                'user_id'  => Auth::id(),
                'position' => $maxPosition + 1,
            ]);

            return back()->with('success', 'タスクを作成しました。');
        } catch (\Exception $e) {
            Log::error('タスク作成エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => 'タスクの作成に失敗しました。']);
        }
    }

    public function update(StoreTaskRequest $request, Task $task): RedirectResponse
    {
        try {
            $this->authorize('update', $task->column->board);
            $task->update($request->validated());
            return back()->with('success', 'タスクを更新しました。');
        } catch (\Exception $e) {
            Log::error('タスク更新エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => 'タスクの更新に失敗しました。']);
        }
    }

    public function destroy(Task $task): RedirectResponse
    {
        try {
            $this->authorize('update', $task->column->board);
            $task->delete();
            return back()->with('success', 'タスクを削除しました。');
        } catch (\Exception $e) {
            Log::error('タスク削除エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => 'タスクの削除に失敗しました。']);
        }
    }
}
