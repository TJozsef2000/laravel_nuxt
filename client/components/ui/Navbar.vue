<template>
  <nav class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <!-- Logo and main navigation -->
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex flex-shrink-0 items-center"
          >
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">Your App</h1>
          </NuxtLink>

          <!-- Always render the container to maintain consistent DOM structure -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <ClientOnly>
              <template v-if="isLoggedIn">
                <NuxtLink
                  to="/dashboard"
                  class="px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
                  active-class="text-primary-600 border-b-2 border-primary-600"
                >
                  Dashboard
                </NuxtLink>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- User menu -->
        <div class="flex items-center space-x-4">
          <!-- Theme switcher -->
          <ThemeSwitcher />

          <!-- Always render the container to maintain consistent DOM structure -->
          <div class="flex items-center space-x-4">
            <ClientOnly>
              <!-- Guest menu -->
              <template v-if="isGuest">
                <NuxtLink
                  to="/login"
                  class="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-200 dark:hover:bg-gray-600/30 dark:hover:text-gray-400"
                >
                  Sign in
                </NuxtLink>
                <NuxtLink
                  to="/register"
                  class="rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Sign up
                </NuxtLink>
              </template>

              <!-- Authenticated user menu -->
              <template v-else-if="isLoggedIn">
                <!-- User dropdown -->
                <Dropdown
                  :items="userMenuItems"
                  placement="bottom-end"
                  class="w-48"
                >
                  <template #trigger>
                    <button
                      class="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-900 transition-colors hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
                    >
                      <Avatar
                        :alt="user?.name"
                        size="sm"
                        class="border border-gray-300 dark:border-gray-600"
                      />
                      <span class="hidden text-sm font-medium sm:block">
                        {{ user?.name }}
                      </span>
                      <!-- Chevron down icon -->
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </template>
                </Dropdown>
              </template>

              <template #fallback>
                <!-- Loading skeleton for authentication state -->
                <div class="h-8 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                <div class="h-8 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button
          @click="toggleMobileMenu"
          class="inline-flex items-center justify-center rounded-md bg-gray-100 p-2 text-gray-900 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-400"
        >
          <svg
            class="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden"
    >
      <div
        class="space-y-1 border-t border-gray-200 bg-gray-50 px-2 pb-3 pt-2 sm:px-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <ClientOnly>
          <template v-if="isLoggedIn">
            <NuxtLink
              to="/dashboard"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
            >
              Dashboard
            </NuxtLink>
            <div class="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
              <button
                class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-900 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
                @click="handleSignOut"
              >
                Sign out
              </button>
            </div>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-200 dark:hover:bg-gray-600/30 dark:hover:text-gray-400"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="mt-2 block rounded-md bg-primary-500 px-3 py-2 text-base font-semibold text-white hover:bg-primary-600"
            >
              Sign up
            </NuxtLink>
          </template>
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import type { ApiError } from '~/types/errors'
  import Avatar from '~/components/ui/Avatar.vue'
  import Dropdown from '~/components/ui/Dropdown.vue'
  import ErrorAlert from '~/components/ui/ErrorAlert.vue'
  import ThemeSwitcher from '~/components/ui/ThemeSwitcher.vue'
  import type { DropdownItem } from '~/types/ui'

  const { user, isLoggedIn, isGuest, signOut } = useAuth()
  const { showSuccess, showError } = useNotifications()

  const mobileMenuOpen = ref(false)
  const isSendingVerification = ref(false)

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

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

  const userMenuItems: DropdownItem[] = [
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
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/settings',
    },
    {
      label: '',
      separator: true,
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: handleSignOut,
    },
  ]
</script>
