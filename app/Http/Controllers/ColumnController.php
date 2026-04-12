<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreColumnRequest;
use App\Models\Board;
use App\Models\Column;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class ColumnController extends Controller
{
    public function store(StoreColumnRequest $request, Board $board): RedirectResponse
    {
        try {
            $this->authorize('update', $board);

            $maxPosition = $board->columns()->max('position') ?? -1;

            $validated = $request->validated();

            $board->columns()->create([
                'name'     => $validated['name'],
                'color'    => $validated['color'] ?? '#6B7280',
                'position' => $maxPosition + 1,
            ]);

            return back()->with('success', 'カラムを追加しました。');
        } catch (\Exception $e) {
            Log::error('カラム作成エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => 'カラムの追加に失敗しました。']);
        }
    }

    public function update(StoreColumnRequest $request, Column $column): RedirectResponse
    {
        try {
            $this->authorize('update', $column->board);
            $column->update($request->validated());
            return back()->with('success', 'カラムを更新しました。');
        } catch (\Exception $e) {
            Log::error('カラム更新エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => 'カラムの更新に失敗しました。']);
        }
    }

    public function destroy(Column $column): RedirectResponse
    {
        try {
            $this->authorize('update', $column->board);
            $column->delete();
            return back()->with('success', 'カラムを削除しました。');
        } catch (\Exception $e) {
            Log::error('カラム削除エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => 'カラムの削除に失敗しました。']);
        }
    }
}
