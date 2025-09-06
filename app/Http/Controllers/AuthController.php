<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Auth\CustomEmailVerificationRequest;
use App\Http\Requests\Auth\EmailVerificationRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Models\User;
use App\Services\AuthService;
use Dedoc\Scramble\Attributes\BodyParameter;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuthController extends BaseRestController
{
    public function __construct(
        private readonly AuthService $authService,
    ) {
        parent::__construct();
    }

    /**
     * Register a new user
     *
     * @throws Exception
     * @throws Throwable
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated(), $request);

            return $this->successResponse(
                data: ['user' => $result['user']],
                message: $result['message'],
                status: Response::HTTP_CREATED
            );
        } catch (ValidationException $e) {
            // Re-throw validation exceptions to be handled by Laravel's validation error handler
            // This will return proper 422 responses with field-specific errors
            throw $e;
        } catch (Exception $e) {
            // Handle unexpected errors (database issues, etc.)
            return $this->errorResponse(
                'Registration failed due to a system error. Please try again.',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Authenticate user login
     *
     * @throws ValidationException|Exception
     */
    #[BodyParameter('email', description: 'User email', type: 'string', default: 'admin@example.com', example: 'admin@example.com')]
    #[BodyParameter('password', description: 'User password', type: 'string', default: '12345678', example: '12345678')]
    #[BodyParameter('remember', description: 'Remember user', type: 'boolean', default: 'true', example: 'true')]
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated(), $request);

            return $this->successResponse(
                data: ['user' => $result['user']],
                message: $result['message'],
            );
        } catch (ValidationException $e) {
            // Re-throw validation exceptions to be handled by Laravel's validation error handler
            // This will return proper 422 responses with field-specific errors
            throw $e;
        } catch (AuthenticationException $e) {
            return $this->errorResponse('The provided credentials are incorrect.', Response::HTTP_UNAUTHORIZED);
        } catch (Exception $e) {
            // Handle unexpected errors (session issues, database problems, etc.)
            return $this->errorResponse(
                'Login failed due to a system error. Please try again.',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $result = $this->authService->logout($request);

        return $this->successMessageResponse($result['message']);
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->forgotPassword($request->validated('email'), $request);

            return $this->successMessageResponse($result['message']);

        } catch (Exception $e) {
            return $this->errorResponse(
                'Unable to send password reset link. Please try again.',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Reset password
     *
     * @throws Throwable
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->resetPassword($request->validated(), $request);

            return $this->successMessageResponse($result['message']);

        } catch (Exception $e) {
            return $this->errorResponse(
                'Password reset failed. Please try again.',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Verify email address
     */
    public function verifyEmail(CustomEmailVerificationRequest $request): JsonResponse|RedirectResponse
    {
        // Get user from route parameter since they might not be authenticated
        $user = User::findOrFail($request->route('id'));

        /** @var string $frontendUrl */
        $frontendUrl = config('app.frontend_url');

        // Verify the hash matches the user's email
        if (! hash_equals(sha1($user->getEmailForVerification()), (string) $request->route('hash'))) {
            if ($request->expectsJson()) {
                return $this->errorResponse('Invalid verification link.', Response::HTTP_FORBIDDEN);
            }

            return redirect($frontendUrl.'/dashboard?verified=0&error=invalid');
        }

        if ($user->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                return $this->successMessageResponse('Email address is already verified.');
            }

            return redirect()->intended(
                $frontendUrl.'/dashboard?verified=1'
            );
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        if ($request->expectsJson()) {
            return $this->successMessageResponse('Email verified successfully!');
        }

        return redirect()->intended(
            $frontendUrl.'/dashboard?verified=1'
        );
    }

    /**
     * Send email verification notification
     */
    public function sendEmailVerification(EmailVerificationRequest $request): JsonResponse|RedirectResponse
    {
        try {
            $user = $request->user();
            $result = $this->authService->sendEmailVerification($user, $request);

            if ($request->expectsJson()) {
                return $this->successMessageResponse($result['message']);
            }

            return redirect()->intended('/dashboard');

        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to send verification email. Please try again.',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Get current authenticated user
     */
    public function user(): JsonResponse
    {
        $userData = $this->authService->getCurrentUser();

        if (! $userData) {
            return $this->errorResponse('Unauthenticated.', Response::HTTP_UNAUTHORIZED);
        }

        // Return user data directly without wrapper (required by nuxt-auth-sanctum)
        return $this->unwrappedResponse($userData);
    }

    /**
     * Update user profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->authService->updateProfile($user, $request->validated(), $request);

            return $this->successResponse(
                data: ['user' => $result['user']],
                message: $result['message'],
            );

        } catch (Exception $e) {
            return $this->errorResponse(
                'Unable to update profile. Please try again.',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }
}
