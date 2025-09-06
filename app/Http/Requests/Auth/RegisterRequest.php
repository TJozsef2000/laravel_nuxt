<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                'regex:/^[\pL\s\-\'\.]+$/u',
            ],
            'email' => [
                'required',
                'string',
                app()->environment('testing') ? 'email:rfc' : 'email:rfc,dns',
                'max:255',
                'unique:users,email',
                'not_regex:/[<>"\']/',
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->numbers(),
            ],
            'terms' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.regex' => 'The name field must only contain letters, spaces, hyphens, apostrophes, and periods.',
            'email.not_regex' => 'The email field contains invalid characters.',
            'terms.accepted' => 'You must accept the terms and conditions.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'full name',
            'email' => 'email address',
            'password' => 'password',
            'password_confirmation' => 'password confirmation',
            'terms' => 'terms and conditions',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => mb_strtolower(mb_trim($this->email ?? '')),
            'name' => mb_trim($this->name ?? ''),
            'terms' => $this->boolean('terms'),
        ]);
    }
}
