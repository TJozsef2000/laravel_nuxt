<?php

declare(strict_types=1);

namespace App\Enums;

enum PermissionEnum: string
{
    // User Management
    case USERS_VIEW = 'users_view';
    case USERS_CREATE = 'users_create';
    case USERS_EDIT = 'users_edit';
    case USERS_DELETE = 'users_delete';
    case USERS_RESTORE = 'users_restore';

}
