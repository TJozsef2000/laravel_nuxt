<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'email:rfc',
                'max:255',
                'not_regex:/[<>"\']/',
            ],
            'password' => [
                'required',
                'string',
                'min:4',
                'max:255',
            ],
            'remember' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.not_regex' => 'The email field contains invalid characters.',
        ];
    }


    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => mb_strtolower(mb_trim($this->email ?? '')),
            'remember' => $this->boolean('remember'),
        ]);
    }
}
