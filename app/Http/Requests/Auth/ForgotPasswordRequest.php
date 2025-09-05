<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                app()->environment('testing') ? 'email:rfc' : 'email:rfc,dns',
                'max:255',
                'exists:users,email',
                'not_regex:/[<>"\']/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.exists' => 'We can\'t find a user with that email address.',
            'email.not_regex' => 'The email field contains invalid characters.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'email address',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => mb_strtolower(mb_trim($this->email ?? '')),
        ]);
    }
}
