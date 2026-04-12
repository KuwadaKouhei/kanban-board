<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskOrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'tasks'             => 'required|array',
            'tasks.*.id'        => 'required|integer|exists:tasks,id',
            'tasks.*.column_id' => 'required|integer|exists:columns,id',
            'tasks.*.position'  => 'required|integer|min:0',
        ];
    }
}
