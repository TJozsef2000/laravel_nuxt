<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogAuthenticationAttempts
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $startTime;

        if (in_array($request->route()?->getName(), [
            'login', 'register', 'password.email', 'password.store', 'logout',
        ])) {
            Log::info('Authentication request processed', [
                'route' => $request->route()?->getName(),
                'method' => $request->method(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status_code' => $response->getStatusCode(),
                'duration_ms' => round($duration * 1000, 2),
                'timestamp' => now()->toISOString(),
            ]);
        }

        return $response;
    }
}
