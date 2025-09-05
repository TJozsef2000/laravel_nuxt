<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;

test('new users can register with valid data', function () {
    Event::fake();

    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'SecureTestPassword2024@!',
        'password_confirmation' => 'SecureTestPassword2024@!',
        'terms' => true,
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email', 'email_verified_at', 'created_at'],
            ],
        ]);

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    Event::assertDispatched(Registered::class);
});

test('registration fails with weak password', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'weak',
        'password_confirmation' => 'weak',
        'terms' => true,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('registration fails with duplicate email', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'SecureTestPassword2024@!',
        'password_confirmation' => 'SecureTestPassword2024@!',
        'terms' => true,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('registration fails without accepting terms', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'SecureTestPassword2024@!',
        'password_confirmation' => 'SecureTestPassword2024@!',
        'terms' => false,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['terms']);
});

test('registration is rate limited', function () {
    // Make 5 failed requests to hit the throttle:5,1 limit (using invalid data to avoid login)
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'invalid-email', // Invalid email to avoid successful registration
            'password' => 'SecureTestPassword2024@!',
            'password_confirmation' => 'SecureTestPassword2024@!',
            'terms' => true,
        ]);
    }

    // This 6th request should be rate limited
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test99@example.com',
        'password' => 'SecureTestPassword2024@!',
        'password_confirmation' => 'SecureTestPassword2024@!',
        'terms' => true,
    ]);

    // Route middleware rate limiting returns 429 (Too Many Requests)
    $response->assertStatus(429);
});
