<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create roles and permissions
    $this->seed(Database\Seeders\PermissionSeeder::class);
});

function createAdminUser(): User
{
    $user = User::factory()->create();
    $user->assignRole('admin');

    return $user;
}

test('authenticated user can list users with pagination', function () {
    $adminUser = createAdminUser();
    User::factory()->count(25)->create();

    $response = $this->actingAs($adminUser)
        ->getJson('/api/users');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'code',
            'message',
            'data' => [
                'items' => [
                    '*' => [
                        'id',
                        'name',
                        'email',
                        'created_at',
                        'updated_at',
                    ],
                ],
                'pagination' => [
                    'current_page',
                    'per_page',
                    'total',
                    'last_page',
                ],
            ],
        ])
        ->assertJson([
            'success' => true,
            'message' => 'Users retrieved successfully',
        ]);

    expect($response->json('data.pagination.total'))->toBe(26); // 25 + admin user
});

test('authenticated user can list users with search filter', function () {
    $adminUser = createAdminUser();
    $searchUser = User::factory()->create([
        'name' => 'Unique Search Name',
        'email' => 'uniquesearch@example.com',
    ]);
    User::factory()->count(5)->create();

    $response = $this->actingAs($adminUser)
        ->getJson('/api/users?search=uniquesearch');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
        ]);

    $items = $response->json('data.items');
    expect($items)->toHaveCount(1);
    expect($items[0]['email'])->toBe('uniquesearch@example.com');
});

test('authenticated user can list users with verification filter', function () {
    $adminUser = createAdminUser();
    $verifiedUser = User::factory()->verified()->create();
    $unverifiedUser = User::factory()->unverified()->create();

    // Test verified users filter
    $response = $this->actingAs($adminUser)
        ->getJson('/api/users?filter_verified=1');

    $response->assertStatus(200);
    $verifiedCount = collect($response->json('data.items'))
        ->where('id', $verifiedUser->id)
        ->count();
    expect($verifiedCount)->toBe(1);

    // Test unverified users filter
    $response = $this->actingAs($adminUser)
        ->getJson('/api/users?filter_verified=0');

    $response->assertStatus(200);
    $unverifiedCount = collect($response->json('data.items'))
        ->where('id', $unverifiedUser->id)
        ->count();
    expect($unverifiedCount)->toBe(1);
});

test('authenticated user can create a new user', function () {
    $adminUser = createAdminUser();

    $userData = [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
    ];

    $response = $this->actingAs($adminUser)
        ->postJson('/api/users', $userData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'created_at',
                'updated_at',
            ],
        ]);

    $this->assertDatabaseHas('users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
    ]);

    // Ensure password is hashed
    $createdUser = User::where('email', 'newuser@example.com')->first();
    expect(password_verify('SecurePassword123!', $createdUser->password))->toBeTrue();
});

test('user creation validates required fields', function () {
    $adminUser = createAdminUser();

    $response = $this->actingAs($adminUser)
        ->postJson('/api/users', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('user creation validates unique email', function () {
    $adminUser = createAdminUser();
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);

    $userData = [
        'name' => 'New User',
        'email' => 'existing@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
    ];

    $response = $this->actingAs($adminUser)
        ->postJson('/api/users', $userData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('authenticated user can view a specific user', function () {
    $adminUser = createAdminUser();
    $targetUser = User::factory()->create([
        'name' => 'Target User',
        'email' => 'target@example.com',
    ]);

    $response = $this->actingAs($adminUser)
        ->getJson("/api/users/{$targetUser->id}");

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'created_at',
                'updated_at',
            ],
        ])
        ->assertJson([
            'data' => [
                'id' => $targetUser->id,
                'name' => 'Target User',
                'email' => 'target@example.com',
            ],
        ]);
});

test('viewing non-existent user returns 404', function () {
    $adminUser = createAdminUser();

    $response = $this->actingAs($adminUser)
        ->getJson('/api/users/99999');

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
            'message' => 'User not found',
        ]);
});

test('authenticated user can update a user', function () {
    $adminUser = createAdminUser();
    $targetUser = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
    ]);

    $updateData = [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ];

    $response = $this->actingAs($adminUser)
        ->putJson("/api/users/{$targetUser->id}", $updateData);

    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'id' => $targetUser->id,
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
            ],
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $targetUser->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ]);
});

test('user update validates unique email excluding current user', function () {
    $adminUser = createAdminUser();
    $targetUser = User::factory()->create(['email' => 'target@example.com']);
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);

    // Should fail when trying to use another user's email
    $response = $this->actingAs($adminUser)
        ->putJson("/api/users/{$targetUser->id}", [
            'email' => 'existing@example.com',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);

    // Should succeed when keeping the same email
    $response = $this->actingAs($adminUser)
        ->putJson("/api/users/{$targetUser->id}", [
            'name' => 'Updated Name',
            'email' => 'target@example.com',
        ]);

    $response->assertStatus(200);
});

test('authenticated user can delete a user', function () {
    $adminUser = createAdminUser();
    $targetUser = User::factory()->create();

    $response = $this->actingAs($adminUser)
        ->deleteJson("/api/users/{$targetUser->id}");

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);

    $this->assertDatabaseMissing('users', [
        'id' => $targetUser->id,
    ]);
});

test('user cannot delete their own account', function () {
    $adminUser = createAdminUser();

    $response = $this->actingAs($adminUser)
        ->deleteJson("/api/users/{$adminUser->id}");

    $response->assertStatus(403)
        ->assertJson([
            'success' => false,
            'message' => 'Cannot delete your own account.',
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $adminUser->id,
    ]);
});

test('authenticated user can toggle email verification status', function () {
    $adminUser = createAdminUser();
    $unverifiedUser = User::factory()->unverified()->create();

    // Verify the user
    $response = $this->actingAs($adminUser)
        ->postJson("/api/users/{$unverifiedUser->id}/toggle-verification");

    $response->assertStatus(200);
    $unverifiedUser->refresh();
    expect($unverifiedUser->hasVerifiedEmail())->toBeTrue();

    // Unverify the user
    $response = $this->actingAs($adminUser)
        ->postJson("/api/users/{$unverifiedUser->id}/toggle-verification");

    $response->assertStatus(200);
    $unverifiedUser->refresh();
    expect($unverifiedUser->hasVerifiedEmail())->toBeFalse();
});

test('authenticated user can get user statistics', function () {
    $adminUser = createAdminUser();
    User::factory()->count(5)->verified()->create();
    User::factory()->count(3)->unverified()->create();

    $response = $this->actingAs($adminUser)
        ->getJson('/api/users-statistics');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'total_users',
                'verified_users',
                'unverified_users',
                'recent_users',
            ],
        ])
        ->assertJson([
            'success' => true,
            'data' => [
                'total_users' => 9, // 5 + 3 + admin
                'verified_users' => 6, // 5 + admin (factory creates verified by default)
                'unverified_users' => 3,
            ],
        ]);
});

test('authenticated user can search users', function () {
    $adminUser = createAdminUser();
    $searchUser = User::factory()->create([
        'name' => 'Searchable User',
        'email' => 'searchable@example.com',
    ]);
    User::factory()->count(5)->create();

    $response = $this->actingAs($adminUser)
        ->getJson('/api/users-search?q=searchable');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Search results retrieved successfully',
        ]);

    $items = $response->json('data.items');
    expect($items)->toHaveCount(1);
    expect($items[0]['email'])->toBe('searchable@example.com');
});

test('user search requires minimum query length', function () {
    $adminUser = createAdminUser();

    $response = $this->actingAs($adminUser)
        ->getJson('/api/users-search?q=a');

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['q']);
});

test('authenticated user can get recent users', function () {
    $adminUser = createAdminUser();

    // Create some recent users
    User::factory()->count(3)->create([
        'created_at' => now()->subDays(2),
    ]);

    // Create some old users
    User::factory()->count(2)->create([
        'created_at' => now()->subDays(10),
    ]);

    $response = $this->actingAs($adminUser)
        ->getJson('/api/users-recent?days=7');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Recent users from last 7 days retrieved successfully',
        ]);

    $items = $response->json('data.items');
    expect(count($items))->toBe(4); // 3 recent + admin user
});

test('guest users cannot access user endpoints', function () {
    $user = User::factory()->create();

    $endpoints = [
        'GET' => ['/api/users', "/api/users/{$user->id}", '/api/users-statistics', '/api/users-search?q=test', '/api/users-recent'],
        'POST' => ['/api/users', "/api/users/{$user->id}/toggle-verification"],
        'PUT' => ["/api/users/{$user->id}"],
        'DELETE' => ["/api/users/{$user->id}"],
    ];

    foreach ($endpoints as $method => $urls) {
        foreach ($urls as $url) {
            $response = match ($method) {
                'GET' => $this->getJson($url),
                'POST' => $this->postJson($url, []),
                'PUT' => $this->putJson($url, []),
                'DELETE' => $this->deleteJson($url),
            };

            $response->assertStatus(401);
        }
    }
});
