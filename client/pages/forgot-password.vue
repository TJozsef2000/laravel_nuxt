<template>
  <div
    class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900"
  >
    <div class="w-full max-w-md space-y-8">
      <div class="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h2 class="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Reset your password
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <!-- Reset Form -->
        <form
          @submit.prevent="handleSubmit"
          class="space-y-6"
        >
          <MaterialInput
            id="email"
            label="Email Address"
            type="email"
            v-model="form.email"
            :required="true"
            :disabled="isLoading"
          />

          <ErrorAlert
            v-if="error"
            :error="error"
            :dismissible="true"
            @dismiss="error = ''"
          />

          <div
            v-if="success"
            class="rounded-md bg-green-50 p-4 dark:bg-green-900/20"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.23a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800 dark:text-green-200">
                  {{ success }}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="flex w-full items-center justify-center rounded-md bg-primary-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isLoading"
          >
            <span>{{ isLoading ? 'Sending...' : 'Send reset link' }}</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?
            <NuxtLink
              to="/login"
              class="font-medium text-primary-500 hover:text-primary-600"
            >
              Sign in here
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ForgotPasswordData } from '~/types/auth'
  import MaterialInput from '~/components/ui/MaterialInput.vue'
  import ErrorAlert from '~/components/ui/ErrorAlert.vue'

  definePageMeta({
    layout: 'default',
    middleware: 'guest',
  })

  const { forgotPassword } = useAuth()
  const { showSuccess, showError } = useNotifications()

  const isLoading = ref(false)

  const form = reactive<ForgotPasswordData>({
    email: '',
  })

  const error = ref<string>('')
  const success = ref<string>('')

  const handleSubmit = async () => {
    isLoading.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await forgotPassword(form)

      if (result.success) {
        success.value =
          'Password reset link sent! Please check your email for further instructions.'
        showSuccess('Password reset link sent to your email!')
        form.email = '' // Clear the form
      } else {
        error.value = result.error || 'Failed to send reset link. Please try again.'
      }
    } catch {
      error.value = 'An unexpected error occurred. Please try again.'
      showError('Failed to send password reset link.')
    } finally {
      isLoading.value = false
    }
  }

  useSeoMeta({
    title: 'Forgot Password',
    description: 'Reset your password',
  })
</script>
