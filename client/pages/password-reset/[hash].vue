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
          <p class="text-sm text-gray-600 dark:text-gray-400">Enter your new password below</p>
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
            :error="getFieldError('email')"
          />

          <MaterialInput
            id="password"
            label="New Password"
            type="password"
            v-model="form.password"
            :required="true"
            :disabled="isLoading"
            :error="getFieldError('password')"
          />

          <MaterialInput
            id="password_confirmation"
            label="Confirm New Password"
            type="password"
            v-model="form.password_confirmation"
            :required="true"
            :disabled="isLoading"
            :error="getFieldError('password_confirmation')"
          />

          <ErrorAlert
            :error="generalError"
            :dismissible="true"
            @dismiss="generalError = ''"
          />

          <button
            type="submit"
            class="flex w-full items-center justify-center rounded-md bg-primary-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isLoading || !hash"
          >
            <span>{{ isLoading ? 'Resetting...' : 'Reset password' }}</span>
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
  import type { ResetPasswordData } from '~/types/auth'
  import MaterialInput from '~/components/ui/MaterialInput.vue'
  import ErrorAlert from '~/components/ui/ErrorAlert.vue'
  import { useFormErrors } from '~/composables/useFormErrors'

  definePageMeta({
    layout: 'default',
    middleware: 'guest',
  })

  const route = useRoute()
  const router = useRouter()
  const { resetPassword } = useAuth()
  const { showSuccess, showError } = useNotifications()

  const isLoading = ref(false)

  // Extract hash from URL params and email from query
  const hash = computed(() => (route.params.hash as string) || '')
  const emailFromQuery = computed(() => (route.query.email as string) || '')

  const form = reactive<ResetPasswordData>({
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  // Use the form errors composable for backend validation
  const {
    fieldErrors,
    generalError,
    hasErrors,
    getFieldError,
    handleValidationErrors,
    clearAllErrors,
    setupFieldWatchers
  } = useFormErrors(toRef(() => form))

  // Setup watchers to clear errors when user types
  setupFieldWatchers()

  // Initialize form with URL parameters
  watchEffect(() => {
    form.token = hash.value
    form.email = emailFromQuery.value
  })

  // Redirect if no hash is provided
  onMounted(() => {
    if (!hash.value) {
      showError('Invalid or missing reset token. Please request a new password reset link.')
      router.push('/forgot-password')
    }
  })

  const handleSubmit = async () => {
    isLoading.value = true
    clearAllErrors() // Clear previous errors

    try {
      const result = await resetPassword(form)

      if (result.success) {
        showSuccess('Password reset successfully! You can now sign in with your new password.')
        await navigateTo('/login')
      } else {
        // Handle validation errors from backend
        if (result.validationErrors) {
          handleValidationErrors(result.validationErrors)
        }
        // Always show general error when reset fails
        generalError.value = result.error || 'Password reset failed. Please try again.'
      }
    } catch (err: unknown) {
      // Handle unexpected errors
      handleValidationErrors(err)
      showError('Password reset failed. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  useSeoMeta({
    title: 'Reset Password',
    description: 'Reset your password',
  })
</script>
