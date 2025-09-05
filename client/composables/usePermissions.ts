import type { PermissionEnum, PermissionCheckOptions } from '~/types/permissions'
import type { User } from '~/types/auth'

export const usePermissions = () => {
  const user = useSanctumUser<User>()

  /**
   * Get user permissions from auth state
   */
  const getUserPermissions = (): readonly string[] => {
    return user.value?.permissions || []
  }

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: PermissionEnum | string): boolean => {
    const userPermissions = getUserPermissions()
    const permissionValue = typeof permission === 'string' ? permission : (permission as string)

    return userPermissions.includes(permissionValue)
  }

  /**
   * Check if user has any of the specified permissions (OR logic)
   */
  const hasAnyPermission = (permissions: (PermissionEnum | string)[]): boolean => {
    const userPermissions = getUserPermissions()

    return permissions.some(permission => {
      const permissionValue = typeof permission === 'string' ? permission : (permission as string)
      return userPermissions.includes(permissionValue)
    })
  }

  /**
   * Check if user has all specified permissions (AND logic)
   */
  const hasAllPermissions = (permissions: (PermissionEnum | string)[]): boolean => {
    const userPermissions = getUserPermissions()

    return permissions.every(permission => {
      const permissionValue = typeof permission === 'string' ? permission : (permission as string)
      return userPermissions.includes(permissionValue)
    })
  }

  /**
   * Flexible permission check with options
   */
  const checkPermissions = (
    permissions: (PermissionEnum | string) | (PermissionEnum | string)[],
    options: PermissionCheckOptions = {}
  ): boolean => {
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions]

    if (options.requireAll) {
      return hasAllPermissions(permissionArray)
    }

    // Default to OR logic
    return hasAnyPermission(permissionArray)
  }

  /**
   * Get user permissions as computed reactive property
   */
  const permissions = computed(() => getUserPermissions())

  /**
   * Check if user is authenticated and has permissions
   */
  const isAuthenticated = computed(() => !!user.value)

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkPermissions,
    permissions: readonly(permissions),
    isAuthenticated: readonly(isAuthenticated),
    getUserPermissions,
  }
}
