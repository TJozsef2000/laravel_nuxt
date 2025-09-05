// Generated TypeScript interfaces for permissions
export enum PermissionEnum {
  // User Management
  USERS_VIEW = 'users_view',
  USERS_CREATE = 'users_create',
  USERS_EDIT = 'users_edit',
  USERS_DELETE = 'users_delete',
  USERS_RESTORE = 'users_restore',
}

export interface UserPermissions {
  permissions: string[]
}

export interface PermissionCheckOptions {
  requireAll?: boolean // If true, user must have ALL permissions (AND logic)
  any?: boolean // If true, user needs ANY of the permissions (OR logic, default)
}
