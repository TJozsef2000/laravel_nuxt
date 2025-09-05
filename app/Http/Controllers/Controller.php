<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Traits\Authorizable;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use Authorizable, AuthorizesRequests, ValidatesRequests;

    /**
     * Methods that should skip auto-authorization
     */
    protected array $skipAuthorization = [];

    /**
     * Auto-authorize before each method execution
     */
    public function __construct()
    {
        // This middleware will run before every controller method
        $this->middleware(function ($request, $next) {
            $method = $this->getCurrentMethod();

            // Skip authorization for specified methods
            if (!in_array($method, $this->skipAuthorization)) {
                $this->autoAuthorize($method);
            }

            return $next($request);
        });
    }
}
