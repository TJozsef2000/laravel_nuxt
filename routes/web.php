<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'api' => config('app.name', 'Laravel API'),
        'version' => '1.0.0',
        'status' => 'operational',
        'documentation' => url('/docs/api'), // if you have scramble API docs
        'timestamp' => now()->toISOString(),
    ]);
});
