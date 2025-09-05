<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create roles and permissions
    $this->seed(PermissionSeeder::class);
});

function createUserWithRole(string $roleName): User
{
    $user = User::factory()->create();
    $user->assignRole($roleName);

    return $user;
}

function createUserWithPermissions(array $permissions): User
{
    $user = User::factory()->create();
    $user->givePermissionTo($permissions);

    return $user;
}

// Test admin role has all permissions
test('admin role can access all user endpoints', function () {
    $adminUser = createUserWithRole('admin');
    $targetUser = User::factory()->create();

    $endpoints = [
        ['method' => 'GET', 'url' => '/api/users', 'expectedStatus' => 200],
        ['method' => 'POST', 'url' => '/api/users', 'data' => [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ], 'expectedStatus' => 201],
        ['method' => 'GET', 'url' => "/api/users/$targetUser->id", 'expectedStatus' => 200],
        ['method' => 'PUT', 'url' => "/api/users/$targetUser->id", 'data' => [
            'name' => 'Updated Name',
        ], 'expectedStatus' => 200],
        ['method' => 'DELETE', 'url' => "/api/users/$targetUser->id", 'expectedStatus' => 200],
        ['method' => 'GET', 'url' => '/api/users-statistics', 'expectedStatus' => 200],
        ['method' => 'GET', 'url' => '/api/users-search?q=test', 'expectedStatus' => 200],
        ['method' => 'GET', 'url' => '/api/users-recent', 'expectedStatus' => 200],
    ];

    foreach ($endpoints as $endpoint) {
        $response = match ($endpoint['method']) {
            'GET' => $this->actingAs($adminUser)->getJson($endpoint['url']),
            'POST' => $this->actingAs($adminUser)->postJson($endpoint['url'], $endpoint['data'] ?? []),
            'PUT' => $this->actingAs($adminUser)->putJson($endpoint['url'], $endpoint['data'] ?? []),
            'DELETE' => $this->actingAs($adminUser)->deleteJson($endpoint['url']),
        };

        $response->assertStatus($endpoint['expectedStatus']);
    }
});

// Test specific permission access
test('user with users_view permission can only access read endpoints', function () {
    $user = createUserWithPermissions(['users_view']);
    $targetUser = User::factory()->create();

    // Should work (read operations)
    $this->actingAs($user)->getJson('/api/users')->assertStatus(200);
    $this->actingAs($user)->getJson("/api/users/$targetUser->id")->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-statistics')->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-search?q=test')->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-recent')->assertStatus(200);

    // Should fail (write operations)
    $this->actingAs($user)
        ->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ])
        ->assertStatus(403)
        ->assertJsonFragment([
            'message' => 'Permission required: users_create',
        ]);

    $this->actingAs($user)
        ->putJson("/api/users/$targetUser->id", ['name' => 'Updated'])
        ->assertStatus(403)
        ->assertJsonFragment([
            'message' => 'Permission required: users_edit',
        ]);

    $this->actingAs($user)
        ->deleteJson("/api/users/$targetUser->id")
        ->assertStatus(403)
        ->assertJsonFragment([
            'message' => 'Permission required: users_delete',
        ]);
});

test('user with users_create permission can create users but not edit or delete', function () {
    $user = createUserWithPermissions(['users_create']);
    $targetUser = User::factory()->create();

    // Should work (create operation)
    $this->actingAs($user)
        ->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ])
        ->assertStatus(201);

    // Should fail (view, edit, delete operations)
    $this->actingAs($user)
        ->getJson('/api/users')
        ->assertStatus(403)
        ->assertJsonFragment([
            'message' => 'Permission required: users_view',
        ]);

    $this->actingAs($user)
        ->putJson("/api/users/$targetUser->id", ['name' => 'Updated'])
        ->assertStatus(403)
        ->assertJsonFragment([
            'message' => 'Permission required: users_edit',
        ]);

    $this->actingAs($user)
        ->deleteJson("/api/users/$targetUser->id")
        ->assertStatus(403)
        ->assertJsonFragment([
            'message' => 'Permission required: users_delete',
        ]);
});

test('user with users_edit permission can edit and toggle verification but not create or delete', function () {
    $user = createUserWithPermissions(['users_edit']);
    $targetUser = User::factory()->create();

    // Should work (edit operations)
    $this->actingAs($user)
        ->putJson("/api/users/$targetUser->id", ['name' => 'Updated Name'])
        ->assertStatus(200);

    $this->actingAs($user)
        ->postJson("/api/users/$targetUser->id/toggle-verification")
        ->assertStatus(200);

    // Should fail (create, view, delete operations)
    $this->actingAs($user)
        ->getJson('/api/users')
        ->assertStatus(403);

    $this->actingAs($user)
        ->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/users/$targetUser->id")
        ->assertStatus(403);
});

test('user with users_delete permission can delete but not create, view or edit', function () {
    $user = createUserWithPermissions(['users_delete']);
    $targetUser = User::factory()->create();

    // Should work (delete operation)
    $this->actingAs($user)
        ->deleteJson("/api/users/$targetUser->id")
        ->assertStatus(200);

    // Should fail (create, view, edit operations)
    $this->actingAs($user)
        ->getJson('/api/users')
        ->assertStatus(403);

    $this->actingAs($user)
        ->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ])
        ->assertStatus(403);

    $newTargetUser = User::factory()->create();
    $this->actingAs($user)
        ->putJson("/api/users/$newTargetUser->id", ['name' => 'Updated'])
        ->assertStatus(403);
});

// Test unauthenticated access
test('unauthenticated users get proper error responses', function () {
    $user = User::factory()->create();

    $endpoints = [
        ['method' => 'GET', 'url' => '/api/users'],
        ['method' => 'POST', 'url' => '/api/users', 'data' => [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ]],
        ['method' => 'GET', 'url' => "/api/users/$user->id"],
        ['method' => 'PUT', 'url' => "/api/users/$user->id", 'data' => ['name' => 'Updated']],
        ['method' => 'DELETE', 'url' => "/api/users/$user->id"],
        ['method' => 'POST', 'url' => "/api/users/$user->id/toggle-verification"],
        ['method' => 'GET', 'url' => '/api/users-statistics'],
        ['method' => 'GET', 'url' => '/api/users-search?q=test'],
        ['method' => 'GET', 'url' => '/api/users-recent'],
    ];

    foreach ($endpoints as $endpoint) {
        $response = match ($endpoint['method']) {
            'GET' => $this->getJson($endpoint['url']),
            'POST' => $this->postJson($endpoint['url'], $endpoint['data'] ?? []),
            'PUT' => $this->putJson($endpoint['url'], $endpoint['data'] ?? []),
            'DELETE' => $this->deleteJson($endpoint['url']),
        };

        $response->assertStatus(401)
            ->assertJsonFragment([
                'message' => 'Unauthenticated.',
            ]);
    }
});

// Test user role (has only view permission)
test('user role has view permissions only', function () {
    $user = createUserWithRole('user');
    $targetUser = User::factory()->create();

    // Should work (view operations)
    $this->actingAs($user)->getJson('/api/users')->assertStatus(200);
    $this->actingAs($user)->getJson("/api/users/$targetUser->id")->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-statistics')->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-search?q=test')->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-recent')->assertStatus(200);

    // Should fail (create, edit, delete operations)
    $this->actingAs($user)
        ->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ])
        ->assertStatus(403);

    $this->actingAs($user)
        ->putJson("/api/users/$targetUser->id", ['name' => 'Updated'])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/users/$targetUser->id")
        ->assertStatus(403);

    $this->actingAs($user)
        ->postJson("/api/users/$targetUser->id/toggle-verification")
        ->assertStatus(403);
});

// Test authorization with multiple permissions (combining different permissions)
test('user with multiple partial permissions can access corresponding endpoints', function () {
    $user = createUserWithPermissions(['users_view', 'users_create']);
    $targetUser = User::factory()->create();

    // Should work (view and create operations)
    $this->actingAs($user)->getJson('/api/users')->assertStatus(200);
    $this->actingAs($user)->getJson("/api/users/$targetUser->id")->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-statistics')->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-search?q=test')->assertStatus(200);
    $this->actingAs($user)->getJson('/api/users-recent')->assertStatus(200);

    $this->actingAs($user)
        ->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ])
        ->assertStatus(201);

    // Should fail (edit and delete operations)
    $this->actingAs($user)
        ->putJson("/api/users/$targetUser->id", ['name' => 'Updated'])
        ->assertStatus(403);

    $this->actingAs($user)
        ->deleteJson("/api/users/$targetUser->id")
        ->assertStatus(403);

    $this->actingAs($user)
        ->postJson("/api/users/$targetUser->id/toggle-verification")
        ->assertStatus(403);
});

// Test custom method authorization
test('custom methods require proper permissions', function () {
    $viewUser = createUserWithPermissions(['users_view']);
    $editUser = createUserWithPermissions(['users_edit']);
    $createUser = createUserWithPermissions(['users_create']);
    $deleteUser = createUserWithPermissions(['users_delete']);
    $targetUser = User::factory()->create();

    // statistics, search, recent require users_view
    $this->actingAs($viewUser)->getJson('/api/users-statistics')->assertStatus(200);
    $this->actingAs($viewUser)->getJson('/api/users-search?q=test')->assertStatus(200);
    $this->actingAs($viewUser)->getJson('/api/users-recent')->assertStatus(200);

    $this->actingAs($createUser)->getJson('/api/users-statistics')->assertStatus(403);
    $this->actingAs($editUser)->getJson('/api/users-statistics')->assertStatus(403);
    $this->actingAs($deleteUser)->getJson('/api/users-statistics')->assertStatus(403);

    // toggleEmailVerification requires users_edit
    $this->actingAs($editUser)->postJson("/api/users/$targetUser->id/toggle-verification")->assertStatus(200);

    $this->actingAs($viewUser)->postJson("/api/users/$targetUser->id/toggle-verification")->assertStatus(403);
    $this->actingAs($createUser)->postJson("/api/users/$targetUser->id/toggle-verification")->assertStatus(403);
    $this->actingAs($deleteUser)->postJson("/api/users/$targetUser->id/toggle-verification")->assertStatus(403);
});

// Test error message formats and consistency
test('authorization errors return consistent JSON format', function () {
    $user = createUserWithPermissions([]);
    $targetUser = User::factory()->create();

    $endpoints = [
        ['method' => 'GET', 'url' => '/api/users', 'permission' => 'users_view'],
        ['method' => 'POST', 'url' => '/api/users', 'permission' => 'users_create', 'data' => [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ]],
        ['method' => 'PUT', 'url' => "/api/users/$targetUser->id", 'permission' => 'users_edit', 'data' => ['name' => 'Updated']],
        ['method' => 'DELETE', 'url' => "/api/users/$targetUser->id", 'permission' => 'users_delete'],
        ['method' => 'POST', 'url' => "/api/users/$targetUser->id/toggle-verification", 'permission' => 'users_edit'],
        ['method' => 'GET', 'url' => '/api/users-statistics', 'permission' => 'users_view'],
        ['method' => 'GET', 'url' => '/api/users-search?q=test', 'permission' => 'users_view'],
        ['method' => 'GET', 'url' => '/api/users-recent', 'permission' => 'users_view'],
    ];

    foreach ($endpoints as $endpoint) {
        $response = match ($endpoint['method']) {
            'GET' => $this->actingAs($user)->getJson($endpoint['url']),
            'POST' => $this->actingAs($user)->postJson($endpoint['url'], $endpoint['data'] ?? []),
            'PUT' => $this->actingAs($user)->putJson($endpoint['url'], $endpoint['data'] ?? []),
            'DELETE' => $this->actingAs($user)->deleteJson($endpoint['url']),
        };

        $response->assertStatus(403)
            ->assertJsonStructure([
                'message',
            ])
            ->assertJsonFragment([
                'message' => "Permission required: {$endpoint['permission']}",
            ]);
    }
});
