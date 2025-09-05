<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else-if="showFallback">
    <slot name="fallback">
      <div
        v-if="fallbackMessage"
        class="text-sm text-gray-500"
      >
        {{ fallbackMessage }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  import type { PermissionEnum, PermissionCheckOptions } from '~/types/permissions'

  interface Props {
    /**
     * Single permission or array of permissions to check
     */
    permissions: PermissionEnum | string | (PermissionEnum | string)[]

    /**
     * Permission check options
     */
    options?: PermissionCheckOptions

    /**
     * Whether to show fallback content when access is denied
     */
    showFallback?: boolean

    /**
     * Default fallback message
     */
    fallbackMessage?: string

    /**
     * Require authentication (default: true)
     */
    requireAuth?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    showFallback: false,
    fallbackMessage: 'You do not have permission to view this content.',
    requireAuth: true,
    options: () => ({}),
  })

  const { checkPermissions, isAuthenticated } = usePermissions()

  /**
   * Check if user has access based on permissions and auth requirements
   */
  const hasAccess = computed(() => {
    // If authentication is required but user is not authenticated
    if (props.requireAuth && !isAuthenticated.value) {
      return false
    }

    // If no authentication required and no permissions specified, allow access
    if (!props.requireAuth && !props.permissions) {
      return true
    }

    // Check permissions
    return checkPermissions(props.permissions, props.options)
  })
</script>
