<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateColumnOrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'columns'              => 'required|array',
            'columns.*.id'         => 'required|integer|exists:columns,id',
            'columns.*.position'   => 'required|integer|min:0',
        ];
    }
}
