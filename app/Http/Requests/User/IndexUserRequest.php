<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class IndexUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add proper authorization logic based on your requirements
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'search' => ['sometimes', 'string', 'max:255'],
            'sort_by' => ['sometimes', 'string', 'in:id,name,email,created_at,updated_at'],
            'sort_order' => ['sometimes', 'string', 'in:asc,desc'],
            'filter_verified' => ['sometimes', 'boolean'],
            'created_from' => ['sometimes', 'date'],
            'created_to' => ['sometimes', 'date', 'after_or_equal:created_from'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'per_page.max' => 'Maximum 100 users can be retrieved per page.',
            'sort_by.in' => 'Invalid sort field. Valid fields are: id, name, email, created_at, updated_at.',
            'sort_order.in' => 'Sort order must be either "asc" or "desc".',
            'created_to.after_or_equal' => 'End date must be after or equal to start date.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function prepareForValidation(): void
    {
        // Set default values
        $this->merge([
            'per_page' => $this->input('per_page', 15),
            'sort_by' => $this->input('sort_by', 'created_at'),
            'sort_order' => $this->input('sort_order', 'desc'),
        ]);
    }
}
