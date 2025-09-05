<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

readonly class UserService
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    /**
     * Get paginated and filtered users
     *
     * @param array<string, mixed> $filters
     * @throws Exception
     */
    public function getUsers(array $filters = []): LengthAwarePaginator
    {
        try {
            $query = User::query();

            // Apply search filter
            if (!empty($filters['search'])) {
                $search = $filters['search'];
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%$search%")
                        ->orWhere('email', 'LIKE', "%$search%");
                });
            }

            // Apply email verification filter
            if (isset($filters['filter_verified'])) {
                if ($filters['filter_verified']) {
                    $query->whereNotNull('email_verified_at');
                } else {
                    $query->whereNull('email_verified_at');
                }
            }

            // Apply date range filter
            if (!empty($filters['created_from'])) {
                $query->whereDate('created_at', '>=', $filters['created_from']);
            }

            if (!empty($filters['created_to'])) {
                $query->whereDate('created_at', '<=', $filters['created_to']);
            }

            // Apply sorting
            $sortBy = $filters['sort_by'] ?? 'created_at';
            $sortOrder = $filters['sort_order'] ?? 'desc';
            $query->orderBy($sortBy, $sortOrder);

            // Apply pagination
            $perPage = min((int) ($filters['per_page'] ?? 15), 100); // Limit max per page

            return $query->paginate($perPage);
        } catch (Throwable $e) {
            Log::error('Failed to get users', [
                'filters' => $filters,
                'error' => $e->getMessage(),
            ]);
            throw new Exception('Failed to retrieve users: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Get a single user by ID
     *
     * @throws Exception
     */
    public function getUserById(int $id): User
    {
        try {
            return $this->userRepository->findByIdOrFail($id);
        } catch (ModelNotFoundException $e) {
            Log::warning('User not found', [
                'user_id' => $id,
                'error' => $e->getMessage(),
            ]);

            throw new Exception("User with ID $id not found.", 404, $e);
        } catch (Throwable $e) {
            Log::error('Error retrieving user', [
                'user_id' => $id,
                'error' => $e->getMessage(),
            ]);

            throw new Exception("Failed to retrieve user with ID $id: " . $e->getMessage(), 500, $e);
        }
    }

    /**
     * Create a new user
     *
     * @param array<string, mixed> $data
     * @throws Exception|Throwable
     */
    public function createUser(array $data, ?Request $request = null): User
    {
        try {
            DB::beginTransaction();

            // Hash password if provided
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            // Set email as unverified by default
            $data['email_verified_at'] = null;

            $user = $this->userRepository->create($data);

            DB::commit();

            $this->logUserEvent('User created successfully', $user, $request, null, [
                'created_by' => auth()->id(),
            ]);

            return $user;

        } catch (Throwable $e) {
            DB::rollBack();

            $this->logUserEvent('User creation failed', null, $request, $e->getMessage(), [
                'email' => $data['email'] ?? 'unknown',
                'created_by' => auth()->id(),
            ]);

            throw new Exception('Failed to create user: ' . $e->getMessage(), 500, $e);
        }
    }

    /**
     * Update an existing user
     *
     * @param array<string, mixed> $data
     * @throws Exception|Throwable
     */
    public function updateUser(int $id, array $data, ?Request $request = null): User
    {
        try {
            DB::beginTransaction();

            $user = $this->getUserById($id);
            $originalEmail = $user->email;

            // Hash password if provided
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            // If email is changed, reset email verification
            if (isset($data['email']) && $data['email'] !== $originalEmail) {
                $data['email_verified_at'] = null;
            }

            $this->userRepository->updateModel($user, $data);
            $user->refresh();

            DB::commit();

            $this->logUserEvent('User updated successfully', $user, $request, null, [
                'updated_by' => auth()->id(),
                'changes' => array_intersect_key($data, array_flip(['name', 'email'])),
            ]);

            return $user;

        } catch (Throwable $e) {
            DB::rollBack();

            $this->logUserEvent('User update failed', null, $request, $e->getMessage(), [
                'user_id' => $id,
                'updated_by' => auth()->id(),
            ]);

            throw new Exception('Failed to update user: ' . $e->getMessage(), 500, $e);
        }
    }

    /**
     * Delete a user
     *
     * @throws Exception|Throwable
     */
    public function deleteUser(int $id, ?Request $request = null): bool
    {
        try {
            DB::beginTransaction();

            $user = $this->getUserById($id);

            // Prevent deletion of own account
            if (auth()->id() === $user->id) {
                throw new Exception('Cannot delete your own account.', 403);
            }

            // Clear user tokens before deletion
            $this->userRepository->clearTokens($user);

            $deleted = $this->userRepository->delete($id);

            DB::commit();

            $this->logUserEvent('User deleted successfully', $user, $request, null, [
                'deleted_by' => auth()->id(),
            ]);

            return $deleted;

        } catch (Throwable $e) {
            DB::rollBack();

            $this->logUserEvent('User deletion failed', null, $request, $e->getMessage(), [
                'user_id' => $id,
                'deleted_by' => auth()->id(),
            ]);

            if ($e->getCode() === 403) {
                throw $e;
            }

            throw new Exception('Failed to delete user: ' . $e->getMessage(), 500, $e);
        }
    }

    /**
     * Toggle user email verification status
     *
     * @throws Exception|Throwable
     */
    public function toggleEmailVerification(int $id, ?Request $request = null): User
    {
        try {
            DB::beginTransaction();

            $user = $this->getUserById($id);

            if ($user->hasVerifiedEmail()) {
                // Unverify email
                $user->email_verified_at = null;
                $user->save();
                $action = 'unverified';
            } else {
                // Verify email
                $user->markEmailAsVerified();
                $action = 'verified';
            }

            DB::commit();

            $this->logUserEvent("User email $action", $user, $request, null, [
                'action_by' => auth()->id(),
            ]);

            return $user;

        } catch (Throwable $e) {
            DB::rollBack();

            $this->logUserEvent('Email verification toggle failed', null, $request, $e->getMessage(), [
                'user_id' => $id,
                'action_by' => auth()->id(),
            ]);

            throw new Exception('Failed to toggle email verification: ' . $e->getMessage(), 500, $e);
        }
    }

    /**
     * Get user statistics
     *
     * @return array<string, int>
     * @throws Exception
     */
    public function getUserStatistics(): array
    {
        try {
            return [
                'total_users' => $this->userRepository->count(),
                'verified_users' => $this->userRepository->countVerifiedUsers(),
                'unverified_users' => $this->userRepository->countUnverifiedUsers(),
                'recent_users' => $this->userRepository->countRecentUsers(7),
            ];
        } catch (Throwable $e) {
            Log::error('Failed to get user statistics', [
                'error' => $e->getMessage(),
            ]);
            throw new Exception('Failed to retrieve user statistics: ' . $e->getMessage(), 500, $e);
        }
    }

    /**
     * Search users
     *
     * @throws Exception
     */
    public function searchUsers(string $query): Collection
    {
        try {
            return $this->userRepository->search($query);
        } catch (Throwable $e) {
            Log::error('Failed to search users', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);
            throw new Exception('Failed to search users: ' . $e->getMessage(), 500, $e);
        }
    }

    /**
     * Get recently registered users
     *
     * @throws Exception
     */
    public function getRecentUsers(int $days = 7): Collection
    {
        try {
            return $this->userRepository->getRecentUsers($days);
        } catch (Throwable $e) {
            Log::error('Failed to get recent users', [
                'days' => $days,
                'error' => $e->getMessage(),
            ]);
            throw new Exception('Failed to retrieve recent users: ' . $e->getMessage(), 500, $e);
        }
    }


    /**
     * Delete multiple users by IDs
     *
     * @param array $userIds Array of user IDs to delete
     * @param Request|null $request
     * @return array Summary of deletion results
     * @throws Exception|Throwable
     */
    public function bulkDeleteUsers(array $userIds, ?Request $request = null): array
    {
        $results = [
            'deleted' => 0,
            'failed' => 0,
            'skipped' => 0,
            'errors' => []
        ];

        try {
            DB::beginTransaction();

            $currentUserId = auth()->id();

            // Get users to delete (exclude current user)
            $users = User::whereIn('id', $userIds)->get();

            foreach ($users as $user) {
                try {
                    // Skip if trying to delete own account
                    if ($currentUserId === $user->id) {
                        $results['skipped']++;
                        $results['errors'][] = "Cannot delete your own account (ID: $user->id)";
                        continue;
                    }

                    // Clear user tokens before deletion
                    $this->userRepository->clearTokens($user);

                    // Delete the user
                    $deleted = $this->userRepository->delete($user->id);

                    if ($deleted) {
                        $results['deleted']++;

                        $this->logUserEvent('User bulk deleted', $user, $request, null, [
                            'deleted_by' => $currentUserId,
                            'bulk_operation' => true,
                        ]);
                    } else {
                        $results['failed']++;
                        $results['errors'][] = "Failed to delete user: $user->name (ID: $user->id)";
                    }

                } catch (Exception $e) {
                    $results['failed']++;
                    $results['errors'][] = "Error deleting user $user->name (ID: $user->id): " . $e->getMessage();

                    Log::error('Bulk delete user failed', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                        'deleted_by' => $currentUserId,
                    ]);
                }
            }

            DB::commit();

            return $results;

        } catch (Exception $e) {
            DB::rollBack();

            $this->logUserEvent('Bulk user deletion failed', null, $request, $e->getMessage(), [
                'user_ids' => $userIds,
                'deleted_by' => auth()->id(),
            ]);

            throw $e;
        }
    }


    /**
     * Log user-related events
     *
     * @param array<string, mixed> $extra
     */
    private function logUserEvent(
        string $message,
        ?User $user,
        ?Request $request,
        ?string $error = null,
        array $extra = []
    ): void {
        $logData = array_merge([
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'ip' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ], $extra);

        if ($error) {
            $logData['error'] = $error;
            Log::error($message, $logData);
        } else {
            Log::info($message, $logData);
        }
    }
}
