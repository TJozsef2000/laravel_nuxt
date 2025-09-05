<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\User\BulkDeleteUserRequest;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\IndexUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends BaseRestController
{
    protected bool $useResourceBasedPermissions = false;

    public function __construct(
        private readonly UserService $userService
    ) {

        // Override default abilities with custom ones
        $this->abilities = array_merge($this->abilities, [
            'statistics' => 'view',
            'search' => 'view',
            'recent' => 'view',
            'toggleEmailVerification' => 'edit',
            'bulkDelete' => 'delete',
        ]);
        parent::__construct();
    }

    /**
     * Display a listing of users with filtering and pagination
     */
    public function index(IndexUserRequest $request): UserCollection|JsonResponse
    {
        try {
            $filters = $request->validated();
            $users = $this->userService->getUsers($filters);

            return new UserCollection(
                $users,
                'Users retrieved successfully', true, 200
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve users',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Store a newly created user
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser(
                $request->validated(),
                $request
            );

            return $this->successResponse(
                new UserResource($user),
                'User created successfully',
                201
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to create user',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Display the specified user
     */
    public function show(int $id): UserResource|JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);

            return new UserResource($user);
        } catch (Exception $e) {
            if ($e->getCode() === 404) {
                return $this->errorResponse('User not found', Response::HTTP_NOT_FOUND);
            }

            return $this->errorResponse(
                'Failed to retrieve user',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Update the specified user
     */
    public function update(UpdateUserRequest $request, int $id): UserResource|JsonResponse
    {
        try {
            $user = $this->userService->updateUser(
                $id,
                $request->validated(),
                $request
            );

            return new UserResource($user);

        } catch (Exception $e) {
            if ($e->getCode() === 404) {
                return $this->errorResponse('User not found', Response::HTTP_NOT_FOUND);
            }

            return $this->errorResponse(
                'Failed to update user',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy(int $id, Request $request): JsonResponse
    {
        try {
            $this->userService->deleteUser($id, $request);

            return $this->successMessageResponse('User deleted successfully');
        } catch (Exception $e) {
            if ($e->getCode() === 404) {
                return $this->errorResponse('User not found', Response::HTTP_NOT_FOUND);
            }

            if ($e->getCode() === 403) {
                return $this->errorResponse(
                    $e->getMessage(),
                    Response::HTTP_FORBIDDEN
                );
            }

            return $this->errorResponse(
                'Failed to delete user',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Toggle user email verification status
     */
    public function toggleEmailVerification(int $id, Request $request): UserResource|JsonResponse
    {
        try {
            $user = $this->userService->toggleEmailVerification($id, $request);

            return new UserResource($user);
        } catch (Exception $e) {
            if ($e->getCode() === 404) {
                return $this->errorResponse('User not found', Response::HTTP_NOT_FOUND);
            }

            return $this->errorResponse(
                'Failed to toggle email verification',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Get user statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = $this->userService->getUserStatistics();

            return $this->successResponse(
                $stats,
                'User statistics retrieved successfully'
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve user statistics',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Search users
     */
    public function search(Request $request): UserCollection|JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2|max:255',
        ]);

        try {
            $users = $this->userService->searchUsers($request->input('q'));

            return new UserCollection(
                $users,
                'Search results retrieved successfully', true, 200
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to search users',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Get recently registered users
     */
    public function recent(Request $request): UserCollection|JsonResponse
    {
        $this->autoAuthorize();

        $request->validate([
            'days' => 'sometimes|integer|min:1|max:30',
        ]);

        try {
            $days = (int) $request->input('days', 7);
            $users = $this->userService->getRecentUsers($days);

            return new UserCollection(
                $users,
                "Recent users from last $days days retrieved successfully", true, 200
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve recent users',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Delete multiple users
     */
    public function bulkDelete(BulkDeleteUserRequest $request): JsonResponse
    {
        try {
            $results = $this->userService->bulkDeleteUsers(
                $request->validated('user_ids'),
                $request
            );

            $message = $this->formatBulkDeleteMessage($results);

            return $this->successResponse(
                $results,
                $message
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                'Failed to delete users',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                $e
            );
        }
    }

    /**
     * Format bulk delete result message
     */
    private function formatBulkDeleteMessage(array $results): string
    {
        $parts = [];

        if ($results['deleted'] > 0) {
            $parts[] = $results['deleted'] . ' user(s) deleted successfully';
        }

        if ($results['skipped'] > 0) {
            $parts[] = $results['skipped'] . ' user(s) skipped';
        }

        if ($results['failed'] > 0) {
            $parts[] = $results['failed'] . ' user(s) failed to delete';
        }

        return empty($parts) ? 'No users processed' : implode(', ', $parts);
    }
}
