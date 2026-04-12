<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBoardRequest;
use App\Models\Board;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    public function index(): Response
    {
        try {
            $boards = Auth::user()->boards()
                ->withCount('columns')
                ->orderBy('position')
                ->get();

            return Inertia::render('Dashboard', [
                'boards' => $boards,
            ]);
        } catch (\Exception $e) {
            Log::error('ボード一覧取得エラー: ' . $e->getMessage());
            return Inertia::render('Dashboard', [
                'boards' => [],
                'flash'  => ['error' => 'ボードの取得に失敗しました。'],
            ]);
        }
    }

    public function store(StoreBoardRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $board = Auth::user()->boards()->create($request->validated());

            foreach (['Todo', 'In Progress', 'Done'] as $i => $name) {
                $board->columns()->create([
                    'name'     => $name,
                    'position' => $i,
                ]);
            }

            DB::commit();

            return redirect()->route('boards.show', $board)
                ->with('success', 'ボードを作成しました。');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ボード作成エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => 'ボードの作成に失敗しました。']);
        }
    }

    public function show(Board $board): Response
    {
        try {
            $this->authorize('view', $board);

            $board->load(['columns.tasks' => function ($query) {
                $query->orderBy('position');
            }]);

            return Inertia::render('Board/Show', [
                'board' => $board,
            ]);
        } catch (AuthorizationException $e) {
            abort(403, 'このボードへのアクセス権がありません。');
        } catch (\Exception $e) {
            Log::error('ボード表示エラー: ' . $e->getMessage());
            return redirect()->route('dashboard')
                ->withErrors(['error' => 'ボードの表示に失敗しました。']);
        }
    }

    public function update(StoreBoardRequest $request, Board $board): RedirectResponse
    {
        try {
            $this->authorize('update', $board);
            $board->update($request->validated());
            return back()->with('success', 'ボードを更新しました。');
        } catch (\Exception $e) {
            Log::error('ボード更新エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => '更新に失敗しました。']);
        }
    }

    public function destroy(Board $board): RedirectResponse
    {
        try {
            $this->authorize('delete', $board);
            $board->delete();
            return redirect()->route('dashboard')
                ->with('success', 'ボードを削除しました。');
        } catch (\Exception $e) {
            Log::error('ボード削除エラー: ' . $e->getMessage());
            return back()->withErrors(['error' => '削除に失敗しました。']);
        }
    }
}
