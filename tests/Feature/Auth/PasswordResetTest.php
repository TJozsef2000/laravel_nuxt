<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

test('reset password link can be requested', function () {
    Notification::fake();

    $user = User::factory()->create();

    $response = $this->postJson('/api/auth/forgot-password', ['email' => $user->email]);

    $response->assertStatus(200)
        ->assertJson(['message' => 'We have emailed your password reset link!']);

    Notification::assertSentTo($user, ResetPassword::class);
});

test('password can be reset with valid token', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->postJson('/api/auth/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function (object $notification) use ($user) {
        $response = $this->postJson('/api/auth/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'SecureTestPassword2024@!',
            'password_confirmation' => 'SecureTestPassword2024@!',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Your password has been reset successfully!']);

        return true;
    });
});
