<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultBoardSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name'     => 'テストユーザー',
            'email'    => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $board = $user->boards()->create([
            'name'        => 'サンプルプロジェクト',
            'description' => 'カンバンボードのデモ用プロジェクトです。',
        ]);

        $priorities = ['low', 'medium', 'high', 'urgent'];

        foreach (['Todo', 'In Progress', 'Done'] as $i => $colName) {
            $column = $board->columns()->create([
                'name'     => $colName,
                'position' => $i,
            ]);

            for ($j = 0; $j < 3; $j++) {
                $column->tasks()->create([
                    'user_id'     => $user->id,
                    'title'       => "{$colName}のタスク" . ($j + 1),
                    'description' => 'サンプルタスクの説明文です。',
                    'priority'    => $priorities[array_rand($priorities)],
                    'due_date'    => now()->addDays(rand(1, 30)),
                    'position'    => $j,
                ]);
            }
        }
    }
}
