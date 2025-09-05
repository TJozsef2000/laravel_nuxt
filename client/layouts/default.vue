<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <Navbar />

    <!-- Main content -->
    <main class="mx-auto max-w-7xl bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 dark:bg-gray-900">
      <slot />
    </main>

    <!-- Toast Notifications handled by global plugin -->
  </div>
</template>

<script setup lang="ts">
  import type { ApiError } from '~/types/errors'
  import Navbar from '~/components/ui/Navbar.vue'

  const { user, isLoggedIn, isGuest, signOut } = useAuth()
  const { showSuccess, showError } = useNotifications()

  const isSendingVerification = ref(false)

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      showSuccess('Successfully signed out!')
    } else {
      showError(result.error || 'Failed to sign out')
    }
  }

  const sendVerificationEmail = async () => {
    isSendingVerification.value = true
    try {
      const client = useSanctumClient()
      await client('/api/auth/email/verification-notification', {
        method: 'POST',
      })
      showSuccess('Verification email sent! Please check your inbox.')
    } catch (error: unknown) {
      const err = error as ApiError
      showError(err.data?.message || 'Failed to send verification email')
    } finally {
      isSendingVerification.value = false
    }
  }

  const userMenuItems = computed(() => [
    [
      {
        label: 'Dashboard',
        icon: 'i-heroicons-home',
        to: '/dashboard',
      },
      {
        label: 'Profile',
        icon: 'i-heroicons-user',
        to: '/profile',
      },
      {
        label: 'User Management',
        icon: 'i-heroicons-users',
        to: '/users',
      },
      {
        label: 'Media Library',
        icon: 'i-heroicons-photo',
        to: '/media',
      },
      {
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/settings',
      },
    ],
    [
      {
        label: 'Sign out',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        onSelect: handleSignOut,
      },
    ],
  ])
</script>
