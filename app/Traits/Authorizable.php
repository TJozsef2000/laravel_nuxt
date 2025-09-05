<?php

declare(strict_types=1);

// app/Traits/Authorizable.php

namespace App\Traits;

use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use ReflectionClass;

trait Authorizable
{
    protected array $abilities = [
        'index' => 'view',
        'index_data' => 'view',
        'index_list' => 'view',
        'edit' => 'edit',
        'show' => 'view',
        'update' => 'edit',
        'create' => 'create',
        'store' => 'create',
        'destroy' => 'delete',
        'restore' => 'restore',
        'trashed' => 'restore',
        'export' => 'export',
        'import' => 'import',
        'bulk_delete' => 'delete',
        'bulk_update' => 'edit',
    ];

    /**
     * Methods requiring multiple permissions (OR logic)
     * Format: ['method' => ['permission1', 'permission2']]
     */
    protected array $multiplePermissions = [];

    /**
     * Methods requiring ALL permissions (AND logic)
     * Format: ['method' => ['permission1', 'permission2']]
     */
    protected array $requiredPermissions = [];

    /**
     * Methods that are publicly accessible
     */
    protected array $publicMethods = [];

    /**
     * Custom authorization callbacks
     * Format: ['method' => callable]
     */
    protected array $customAuthorization = [];

    protected ?string $resourceName = null;

    protected bool $useResourceBasedPermissions = false;

    protected bool $cachePermissions = true;

    /**
     * Enhanced auto-authorization with multiple strategies
     */
    protected function autoAuthorize(?string $method = null): void
    {
        $method = $method ?? $this->getCurrentMethod();

        // Skip if method is public
        if (in_array($method, $this->publicMethods)) {
            return;
        }

        // Handle custom authorization
        if (isset($this->customAuthorization[$method])) {
            call_user_func($this->customAuthorization[$method], $method);

            return;
        }

        // Handle multiple permissions (OR logic)
        if (isset($this->multiplePermissions[$method])) {
            $this->authorizeAnyPermission($this->multiplePermissions[$method]);

            return;
        }

        // Handle required permissions (AND logic)
        if (isset($this->requiredPermissions[$method])) {
            $this->authorizeAllPermissions($this->requiredPermissions[$method]);

            return;
        }

        // Standard single permission
        $permission = $this->getPermissionForMethod($method);
        if ($permission) {
            $this->authorizePermission($permission);
        }
    }

    /**
     * Get permission with caching
     */
    protected function getPermissionForMethod(string $method): ?string
    {
        if (! $this->cachePermissions) {
            return $this->generatePermission($method);
        }

        $cacheKey = sprintf(
            'permission_%s_%s_%s',
            get_class($this),
            $method,
            md5(serialize($this->abilities))
        );

        return Cache::remember($cacheKey, 3600, function () use ($method) {
            return $this->generatePermission($method);
        });
    }

    /**
     * Authorize any of the given permissions (OR logic)
     */
    protected function authorizeAnyPermission(array $permissions): void
    {
        if (! Auth::check()) {
            throw new AuthorizationException('Authentication required');
        }

        $user = Auth::user();
        $resourcePermissions = array_map(function ($permission) {
            return $this->formatPermission($permission);
        }, $permissions);

        foreach ($resourcePermissions as $permission) {
            if ($user->can($permission)) {
                return; // User has at least one permission
            }
        }

        throw new AuthorizationException(
            'Insufficient permissions. Required any of: '.implode(', ', $resourcePermissions)
        );
    }

    /**
     * Authorize all given permissions (AND logic)
     */
    protected function authorizeAllPermissions(array $permissions): void
    {
        if (! Auth::check()) {
            throw new AuthorizationException('Authentication required');
        }

        $user = Auth::user();
        $resourcePermissions = array_map(function ($permission) {
            return $this->formatPermission($permission);
        }, $permissions);

        foreach ($resourcePermissions as $permission) {
            if (! $user->can($permission)) {
                throw new AuthorizationException(
                    "Missing required permission: $permission"
                );
            }
        }
    }

    /**
     * Add custom authorization for a method
     */
    protected function addCustomAuthorization(string $method, callable $callback): void
    {
        $this->customAuthorization[$method] = $callback;
    }

    /**
     * Add multiple permissions requirement (OR logic)
     */
    protected function addMultiplePermissions(string $method, array $permissions): void
    {
        $this->multiplePermissions[$method] = $permissions;
    }

    /**
     * Get resource name with improved auto-detection
     */
    protected function getResourceName(): string
    {
        if ($this->resourceName) {
            return $this->resourceName;
        }

        // Try to get from route first
        $route = request()->route();
        if ($route && $route->hasParameter('model')) {
            $model = $route->parameter('model');
            if (is_object($model)) {
                return Str::snake(Str::plural(class_basename($model)));
            }
        }

        // Fallback to controller name
        $className = (new ReflectionClass($this))->getShortName();
        $resource = str_replace('Controller', '', $className);

        return Str::snake(Str::plural($resource));
    }

    /**
     * Authorize permission
     */
    protected function authorizePermission(PermissionEnum|string $permission): void
    {
        if (! Auth::check()) {
            throw new AuthorizationException('Authentication required');
        }

        $permissionValue = $permission instanceof PermissionEnum ? $permission->value : $permission;

        if (! Auth::user()->can($permissionValue)) {
            throw new AuthorizationException("Permission required: $permissionValue");
        }
    }

    /**
     * Get current method with improved detection
     */
    protected function getCurrentMethod(): string
    {
        // Try route action method first
        $route = request()->route();
        if ($route) {
            $action = $route->getAction();
            if (isset($action['method'])) {
                return $action['method'];
            }

            // Extract from controller@method format
            if (isset($action['controller'])) {
                $parts = explode('@', $action['controller']);
                if (count($parts) === 2) {
                    return $parts[1];
                }
            }
        }

        // Fallback to backtrace
        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10);

        foreach ($trace as $call) {
            if (isset($call['class']) &&
                str_ends_with($call['class'], 'Controller') &&
                ! in_array($call['function'], ['autoAuthorize', '__call', '__construct'])) {
                return $call['function'];
            }
        }

        return 'unknown';
    }

    /**
     * Get detailed authorization info for debugging
     */
    protected function getAuthorizationInfo(): array
    {
        $method = $this->getCurrentMethod();

        return [
            'controller' => get_class($this),
            'method' => $method,
            'resource' => $this->getResourceName(),
            'is_public' => in_array($method, $this->publicMethods),
            'has_custom_auth' => isset($this->customAuthorization[$method]),
            'multiple_permissions' => $this->multiplePermissions[$method] ?? null,
            'required_permissions' => $this->requiredPermissions[$method] ?? null,
            'standard_permission' => $this->getPermissionForMethod($method),
            'user_authenticated' => Auth::check(),
            'user_id' => Auth::id(),
        ];
    }

    private function generatePermission(string $method): ?string
    {
        if (! isset($this->abilities[$method])) {
            return null;
        }

        $ability = $this->abilities[$method];
        $resource = $this->getResourceName();

        return $this->useResourceBasedPermissions
            ? "$resource.$ability"
            : "{$resource}_$ability";
    }

    /**
     * Format permission with resource prefix if needed
     */
    private function formatPermission(string $permission): string
    {
        // If permission already contains dot or underscore, assume it's complete
        if (str_contains($permission, '.') || str_contains($permission, '_')) {
            return $permission;
        }

        $resource = $this->getResourceName();

        return $this->useResourceBasedPermissions
            ? "$resource.$permission"
            : "{$permission}_$resource";
    }
}
