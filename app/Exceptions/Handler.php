<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception): JsonResponse|Response
    {
        // Convert authorization exceptions to proper JSON responses for API routes
        if ($request->expectsJson() || $request->is('api/*')) {

            if ($exception instanceof AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                    'data' => null,
                ], Response::HTTP_UNAUTHORIZED);
            }

            if ($exception instanceof AuthorizationException) {
                return response()->json([
                    'success' => false,
                    'message' => $exception->getMessage() ?: 'Insufficient permissions',
                    'data' => null,
                ], Response::HTTP_FORBIDDEN);
            }
        }

        return parent::render($request, $exception);
    }
}
