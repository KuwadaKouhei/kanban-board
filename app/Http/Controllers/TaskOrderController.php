<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTaskOrderRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TaskOrderController extends Controller
{
    public function update(UpdateTaskOrderRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            foreach ($request->validated()['tasks'] as $item) {
                Task::where('id', $item['id'])
                    ->where('user_id', Auth::id())
                    ->update([
                        'column_id' => $item['column_id'],
                        'position'  => $item['position'],
                    ]);
            }

            DB::commit();
            return response()->json(['message' => '並び順を更新しました。']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('タスク並び替えエラー: ' . $e->getMessage());
            return response()->json(['error' => '並び替えに失敗しました。'], 500);
        }
    }
}
