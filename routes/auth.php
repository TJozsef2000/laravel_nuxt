<?php

declare(strict_types=1);

// use App\Http\Controllers\Auth\AuthenticatedSessionController;
// use App\Http\Controllers\Auth\EmailVerificationNotificationController;
// use App\Http\Controllers\Auth\NewPasswordController;
// use App\Http\Controllers\Auth\PasswordResetLinkController;
// use App\Http\Controllers\Auth\RegisteredUserController;
// use App\Http\Controllers\Auth\VerifyEmailController;
// use Illuminate\Support\Facades\Route;

// Route::middleware(['guest', 'throttle:5,1'])->group(function () {
//    Route::post('/register', [RegisteredUserController::class, 'store'])
//        ->name('register');
//
//    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
//        ->name('login');
//
//    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
//        ->middleware('throttle:3,1')
//        ->name('password.email');
//
//    Route::post('/reset-password', [NewPasswordController::class, 'store'])
//        ->middleware('throttle:5,15')
//        ->name('password.store');
// });
//
// Route::middleware(['auth', 'throttle:10,1'])->group(function () {
//    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
//        ->middleware(['signed', 'throttle:3,1'])
//        ->name('verification.verify');
//
//    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
//        ->middleware('throttle:3,10')
//        ->name('verification.send');
//
//    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
//        ->middleware('throttle:10,1')
//        ->name('logout');
// });
