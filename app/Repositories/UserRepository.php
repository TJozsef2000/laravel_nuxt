<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    /**
     * Create a new user
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Find user by ID
     */
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    /**
     * Find user by ID or fail
     */
    public function findByIdOrFail(int $id): User
    {
        return User::findOrFail($id);
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Find user by email or fail
     */
    public function findByEmailOrFail(string $email): User
    {
        $user = $this->findByEmail($email);

        if (! $user) {
            throw new ModelNotFoundException("User with email $email not found");
        }

        return $user;
    }

    /**
     * Update user by ID
     */
    public function update(int $id, array $data): bool
    {
        $user = $this->findByIdOrFail($id);

        return $user->update($data);
    }

    /**
     * Update user model
     */
    public function updateModel(User $user, array $data): bool
    {
        return $user->update($data);
    }

    /**
     * Delete user by ID
     */
    public function delete(int $id): bool
    {
        $user = $this->findByIdOrFail($id);

        return $user->delete();
    }

    /**
     * Get all users
     */
    public function all(): Collection
    {
        return User::all();
    }

    /**
     * Get paginated users
     */
    public function paginated(int $perPage = 15): array|LengthAwarePaginator
    {
        return User::paginate($perPage);
    }

    /**
     * Check if user exists by email
     */
    public function existsByEmail(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    /**
     * Count users with verified emails
     */
    public function countVerifiedUsers(): int
    {
        return User::whereNotNull('email_verified_at')->count();
    }

    /**
     * Count users with unverified emails
     */
    public function countUnverifiedUsers(): int
    {
        return User::whereNull('email_verified_at')->count();
    }

    /**
     * Get users created between dates
     */
    public function getUsersCreatedBetween(string $startDate, string $endDate): Collection
    {
        return User::whereBetween('created_at', [$startDate, $endDate])->get();
    }

    /**
     * Get users count
     */
    public function count(): int
    {
        return User::count();
    }

    /**
     * Search users by name or email
     */
    public function search(string $query): Collection
    {
        return User::where('name', 'LIKE', "%$query%")
            ->orWhere('email', 'LIKE', "%$query%")
            ->get();
    }

    /**
     * Get recently registered users
     */
    public function getRecentUsers(int $days = 7): Collection
    {
        return User::where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function countRecentUsers(int $days = 7): int
    {
        return User::where('created_at', '>=', now()->subDays($days))
            ->count();
    }

    /**
     * Mark email as verified
     */
    public function markEmailAsVerified(User $user): bool
    {
        return $user->markEmailAsVerified();
    }

    /**
     * Update user's remember token
     */
    public function updateRememberToken(User $user, string $token): bool
    {
        return $user->update(['remember_token' => $token]);
    }

    /**
     * Clear user's tokens
     */
    public function clearTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Get user with specific relationship
     */
    public function findWithRelations(int $id, array $relations = []): ?User
    {
        return User::with($relations)->find($id);
    }
}
