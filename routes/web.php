<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardOrderController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\ColumnOrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // ダッシュボード（ボード一覧）
    Route::get('/dashboard', [BoardController::class, 'index'])->name('dashboard');

    // ボード CRUD
    Route::resource('boards', BoardController::class)->except(['index', 'create', 'edit']);

    // カラム
    Route::post('/boards/{board}/columns', [ColumnController::class, 'store'])
        ->name('columns.store');
    Route::put('/columns/{column}', [ColumnController::class, 'update'])
        ->name('columns.update');
    Route::delete('/columns/{column}', [ColumnController::class, 'destroy'])
        ->name('columns.destroy');

    // タスク
    Route::post('/columns/{column}/tasks', [TaskController::class, 'store'])
        ->name('tasks.store');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])
        ->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])
        ->name('tasks.destroy');

    // タスク並び替え（Ajax）
    Route::put('/tasks-reorder', [TaskOrderController::class, 'update'])
        ->name('tasks.reorder');

    // ボード並び替え（Ajax）
    Route::put('/boards-reorder', [BoardOrderController::class, 'update'])
        ->name('boards.reorder');

    // カラム並び替え（Ajax）
    Route::put('/columns-reorder', [ColumnOrderController::class, 'update'])
        ->name('columns.reorder');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
