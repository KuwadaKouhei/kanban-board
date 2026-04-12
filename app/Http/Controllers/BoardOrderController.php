<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateBoardOrderRequest;
use App\Models\Board;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BoardOrderController extends Controller
{
    public function update(UpdateBoardOrderRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            foreach ($request->validated()['boards'] as $item) {
                Board::where('id', $item['id'])
                    ->where('user_id', Auth::id())
                    ->update(['position' => $item['position']]);
            }

            DB::commit();
            return response()->json(['message' => 'ボードの並び順を更新しました。']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ボード並び替えエラー: ' . $e->getMessage());
            return response()->json(['error' => 'ボードの並び替えに失敗しました。'], 500);
        }
    }
}
