<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Security Settings
    |--------------------------------------------------------------------------
    |
    | These settings control various security aspects of the authentication
    | system including rate limiting, password policies, and session security.
    |
    */

    'rate_limiting' => [
        'login' => [
            'max_attempts' => 5,
            'decay_minutes' => 1,
        ],
        'register' => [
            'max_attempts' => 3,
            'decay_minutes' => 60,
        ],
        'password_reset' => [
            'max_attempts' => 3,
            'decay_minutes' => 60,
        ],
        'email_verification' => [
            'max_attempts' => 3,
            'decay_minutes' => 10,
        ],
    ],

    'password_policy' => [
        'min_length' => 8,
        'require_uppercase' => true,
        'require_lowercase' => true,
        'require_numbers' => true,
        'require_symbols' => true,
        'check_compromised' => true,
    ],

    'session' => [
        'regenerate_on_login' => true,
        'invalidate_on_logout' => true,
        'lifetime' => 120, // minutes
    ],

    'security_headers' => [
        'x_content_type_options' => 'nosniff',
        'x_frame_options' => 'DENY',
        'x_xss_protection' => '1; mode=block',
        'referrer_policy' => 'strict-origin-when-cross-origin',
        'permissions_policy' => 'geolocation=(), microphone=(), camera=()',
        'strict_transport_security' => [
            'enabled' => true,
            'max_age' => 31536000,
            'include_subdomains' => true,
            'preload' => true,
        ],
    ],

    'logging' => [
        'authentication_attempts' => true,
        'failed_logins' => true,
        'successful_logins' => true,
        'password_resets' => true,
        'email_verifications' => true,
        'registrations' => true,
    ],

];
