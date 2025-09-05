<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class BaseRestController extends Controller
{
    /**
     * Success response with data
     */
    protected function successResponse($data = null, string $message = 'Success', int $status = Response::HTTP_OK, array $additional = []): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];

        return response()->json(array_merge($response, $additional), $status, [], JSON_PRESERVE_ZERO_FRACTION);
    }

    /**
     * Success response with only message (for simple operations)
     */
    protected function successMessageResponse(string $message = 'Success', int $status = Response::HTTP_OK, array $additional = []): JsonResponse
    {
        return $this->successResponse(
            data: null,
            message: $message,
            status: $status,
            additional: $additional
        );
    }

    /**
     * Error response
     */
    protected function errorResponse(string $message = 'Unsuccessful request', int $status = Response::HTTP_BAD_REQUEST, ?Exception $exception = null, array $additional = []): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
            'data' => null,
        ];

        if (config('app.debug') && $exception) {
            $response['debug'] = [
                'exception' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ];
        }

        return response()->json(array_merge($response, $additional), $status);
    }

    /**
     * Raw data response (for special cases like nuxt-auth-sanctum user endpoint)
     */
    protected function unwrappedResponse($data, int $status = Response::HTTP_OK): JsonResponse
    {
        return response()->json($data, $status);
    }
}
