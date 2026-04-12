<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBoardOrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'boards'             => 'required|array',
            'boards.*.id'        => 'required|integer|exists:boards,id',
            'boards.*.position'  => 'required|integer|min:0',
        ];
    }
}
