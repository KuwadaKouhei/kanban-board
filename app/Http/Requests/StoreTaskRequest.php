<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority'    => 'required|in:low,medium,high,urgent',
            'due_date'    => 'nullable|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'          => 'タイトルは必須です。',
            'title.max'               => 'タイトルは255文字以内で入力してください。',
            'priority.in'             => '有効な優先度を選択してください。',
            'due_date.after_or_equal' => '期限日は今日以降の日付を指定してください。',
        ];
    }
}
