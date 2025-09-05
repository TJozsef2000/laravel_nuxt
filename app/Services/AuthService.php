<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

readonly class AuthService
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    /**
     * Register a new user
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     * @throws ValidationException
     * @throws Exception|Throwable
     */
    public function register(array $data, Request $request): array
    {
        try {
            DB::beginTransaction();

            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'email_verified_at' => null,
            ];

            $user = $this->userRepository->create($userData);

            event(new Registered($user));

            Auth::login($user, $data['remember'] ?? false);

            DB::commit();

            $this->logAuthEvent('User registered successfully', $user, $request);

            return [
                'success' => true,
                'user' => UserResource::make($user)->toArray($request),
                'message' => 'Registration successful',
            ];

        } catch (Throwable $e) {
            DB::rollBack();

            $this->logAuthEvent('Registration failed', null, $request, $e->getMessage(), [
                'email' => $data['email'] ?? null,
            ]);

            if ($e instanceof ValidationException) {
                throw $e;
            }

            throw new Exception('Registration failed: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Authenticate user login
     *
     * @param array<string, mixed> $credentials
     * @return array<string, mixed>
     * @throws ValidationException|Exception
     */
    public function login(array $credentials, Request $request): array
    {
        try {
            $remember = $credentials['remember'] ?? false;
            $loginCredentials = ['email' => $credentials['email'], 'password' => $credentials['password']];

            if (! Auth::attempt($loginCredentials, $remember)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            if ($request->hasSession()) {
                $request->session()->regenerate();
            }

            /** @var User $user */
            $user = Auth::user();

            $this->logAuthEvent('User logged in successfully', $user, $request);

            return [
                'success' => true,
                'user' => UserResource::make($user)->toArray($request),
                'message' => 'Login successful',
            ];

        } catch (ValidationException $e) {
            $this->logAuthEvent('Login attempt failed', null, $request, $e->getMessage(), [
                'email' => $credentials['email'] ?? null,
            ]);
            throw $e;
        } catch (Throwable $e) {
            $this->logAuthEvent('Login attempt failed', null, $request, $e->getMessage(), [
                'email' => $credentials['email'] ?? null,
            ]);
            throw new Exception('Login failed: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Logout user
     *
     * @return array<string, mixed>
     */
    public function logout(Request $request): array
    {
        try {
            $user = Auth::user();

            Auth::forgetUser();

            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            $this->logAuthEvent('User logged out successfully', $user, $request);

            return [
                'success' => true,
                'message' => 'Logout successful',
            ];
        } catch (Throwable $e) {
            $this->logAuthEvent('Logout failed', Auth::user(), $request, $e->getMessage());

            // Even if logout fails, we should still return success for security
            return [
                'success' => true,
                'message' => 'Logout successful',
            ];
        }
    }

    /**
     * Send password reset link
     *
     * @return array<string, mixed>
     * @throws ValidationException
     * @throws Exception
     */
    public function forgotPassword(string $email, Request $request): array
    {
        try {
            $status = Password::sendResetLink(['email' => $email]);

            if ($status === Password::RESET_LINK_SENT) {
                $this->logAuthEvent('Password reset link sent', null, $request, null, [
                    'email' => $email,
                ]);

                return [
                    'success' => true,
                    'message' => 'We have emailed your password reset link!',
                ];
            }

            $this->logAuthEvent('Password reset link failed', null, $request, $status, [
                'email' => $email,
            ]);

            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);

        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->logAuthEvent('Password reset link error', null, $request, $e->getMessage(), [
                'email' => $email,
            ]);

            throw new Exception('Failed to send password reset link: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Reset password
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     * @throws ValidationException
     * @throws Exception|Throwable
     */
    public function resetPassword(array $data, Request $request): array
    {
        try {
            DB::beginTransaction();

            $status = Password::reset(
                $data,
                function (User $user) use ($request, $data): void {
                    $user->forceFill([
                        'password' => Hash::make($data['password']),
                        'remember_token' => Str::random(60),
                    ])->save();

                    $user->tokens()->delete();

                    event(new PasswordReset($user));

                    $this->logAuthEvent('Password reset successful', $user, $request);
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                DB::commit();

                return [
                    'success' => true,
                    'message' => 'Your password has been reset successfully!',
                ];
            }

            DB::rollBack();

            $this->logAuthEvent('Password reset failed', null, $request, $status, [
                'email' => $data['email'] ?? null,
            ]);

            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (Throwable $e) {
            DB::rollBack();

            $this->logAuthEvent('Password reset error', null, $request, $e->getMessage(), [
                'email' => $data['email'] ?? null,
            ]);

            throw new Exception('Password reset failed: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Verify email address
     *
     * @return array<string, mixed>
     * @throws Exception
     */
    public function verifyEmail(User $user, Request $request): array
    {
        try {
            if ($user->hasVerifiedEmail()) {
                $this->logAuthEvent('Email verification attempted on already verified account', $user, $request);

                return [
                    'success' => true,
                    'message' => 'Email address is already verified.',
                    'user' => UserResource::make($user)->toArray($request),
                ];
            }

            if ($user->markEmailAsVerified()) {
                event(new Verified($user));
                $this->logAuthEvent('Email verified successfully', $user, $request);
            }

            return [
                'success' => true,
                'message' => 'Email verified successfully!',
                'user' => UserResource::make($user)->toArray($request),
            ];
        } catch (Throwable $e) {
            $this->logAuthEvent('Email verification failed', $user, $request, $e->getMessage());
            throw new Exception('Email verification failed: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Send email verification notification
     *
     * @return array<string, mixed>
     * @throws Exception
     */
    public function sendEmailVerification(User $user, Request $request): array
    {
        if ($user->hasVerifiedEmail()) {
            $this->logAuthEvent('Verification email requested for already verified account', $user, $request);

            return [
                'success' => true,
                'message' => 'Email address is already verified.',
            ];
        }

        try {
            $user->sendEmailVerificationNotification();

            $this->logAuthEvent('Email verification notification sent', $user, $request);

            return [
                'success' => true,
                'message' => 'A fresh verification link has been sent to your email address.',
            ];

        } catch (Throwable $e) {
            $this->logAuthEvent('Failed to send email verification notification', $user, $request, $e->getMessage());

            throw new Exception('Failed to send email verification: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Update user profile
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     * @throws Exception|Throwable
     */
    public function updateProfile(User $user, array $data, Request $request): array
    {
        try {
            $originalEmail = $user->email;
            $emailChanged = isset($data['email']) && $originalEmail !== $data['email'];

            DB::beginTransaction();

            $this->userRepository->update($user->id, $data);
            $user->refresh();

            if ($emailChanged) {
                $user->email_verified_at = null;
                $user->save();

                $user->sendEmailVerificationNotification();

                $this->logAuthEvent('User email changed, verification reset', $user, $request, null, [
                    'old_email' => $originalEmail,
                    'new_email' => $user->email,
                ]);
            }

            DB::commit();

            $this->logAuthEvent('User profile updated', $user, $request, null, [
                'changes' => array_intersect_key($data, array_flip(['name', 'email'])),
            ]);

            return [
                'success' => true,
                'user' => UserResource::make($user)->toArray($request),
                'message' => $emailChanged
                    ? 'Profile updated. Please verify your new email address.'
                    : 'Profile updated successfully.',
            ];

        } catch (Throwable $e) {
            DB::rollBack();

            $this->logAuthEvent('Profile update error', $user, $request, $e->getMessage());

            throw new Exception('Profile update failed: ' . $e->getMessage(), 0, $e);
        }
    }


    /**
     * Get current authenticated user
     *
     * @return array<string, mixed>|null
     */
    public function getCurrentUser(): ?array
    {
        /** @var User|null $user */
        $user = Auth::user();

        return $user ? UserResource::make($user)->toArray(request()) : null;
    }


    /**
     * Log authentication events
     *
     * @param array<string, mixed> $extra
     */
    private function logAuthEvent(
        string $message,
        ?User $user,
        Request $request,
        ?string $error = null,
        array $extra = []
    ): void {
        $logData = array_merge([
            'user_id' => $user?->id,
            'email' => $user?->email,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ], $extra);

        if ($error) {
            $logData['error'] = $error;
            Log::warning($message, $logData);
        } else {
            Log::info($message, $logData);
        }
    }
}
