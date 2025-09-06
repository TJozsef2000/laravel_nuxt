<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public authentication routes (guest only)
Route::middleware(['guest', 'throttle:10,1'])->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register'])
        ->name('api.auth.register');

    Route::post('/auth/login', [AuthController::class, 'login'])
        ->name('api.auth.login');

    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])
        ->middleware('throttle:3,1')
        ->name('api.auth.forgot-password');

    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:10,10')
        ->name('api.auth.reset-password');
});

// Email verification route (can be accessed without authentication)
Route::get('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['throttle:15,1'])
    ->name('verification.verify'); // Laravel expects this specific name


// Protected authentication routes (auth required)
Route::middleware(['auth:sanctum', 'throttle:30,1'])->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user'])
        ->name('api.auth.user');

    Route::post('/auth/logout', [AuthController::class, 'logout'])
        ->name('api.auth.logout');

    Route::put('/auth/profile', [AuthController::class, 'updateProfile'])
        ->name('api.auth.update-profile');

    Route::post('/auth/email/verification-notification', [AuthController::class, 'sendEmailVerification'])
        ->middleware('throttle:3,10')
        ->name('api.auth.verification-notification');
});

// Protected user management routes (requires authentication)
Route::middleware(['auth:sanctum', 'throttle:30,1'])->group(function () {
    // User CRUD operations
    Route::apiResource('users', UserController::class);

    // Additional user endpoints
    Route::post('/users/{id}/toggle-verification', [UserController::class, 'toggleEmailVerification'])
        ->name('api.users.toggle-verification');

    Route::get('/users-statistics', [UserController::class, 'statistics'])
        ->name('api.users.statistics');

    Route::get('/users-search', [UserController::class, 'search'])
        ->name('api.users.search');

    Route::get('/users-recent', [UserController::class, 'recent'])
        ->name('api.users.recent');

    // Bulk operations
    Route::delete('/users/bulk-delete', [UserController::class, 'bulkDelete'])
        ->name('api.users.bulk-delete');
});
