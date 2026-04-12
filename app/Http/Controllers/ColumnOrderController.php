<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateColumnOrderRequest;
use App\Models\Column;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ColumnOrderController extends Controller
{
    public function update(UpdateColumnOrderRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            foreach ($request->validated()['columns'] as $item) {
                Column::where('id', $item['id'])
                    ->update(['position' => $item['position']]);
            }

            DB::commit();
            return response()->json(['message' => 'カラムの並び順を更新しました。']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('カラム並び替えエラー: ' . $e->getMessage());
            return response()->json(['error' => 'カラムの並び替えに失敗しました。'], 500);
        }
    }
}
