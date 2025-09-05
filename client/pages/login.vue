<template>
    <div
        class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900"
    >
        <div class="w-full max-w-md space-y-8">
            <div class="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                <!-- Header -->
                <div class="mb-8 text-center">
                    <h2 class="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">Log in</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?
                        <NuxtLink
                            to="/register"
                            class="font-medium text-primary-500 hover:text-primary-600"
                        >
                            Sign up
                        </NuxtLink>
                    </p>
                </div>

                <!-- Login Form -->
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

                    <MaterialInput
                        id="password"
                        label="Password"
                        type="password"
                        v-model="form.password"
                        :required="true"
                        :disabled="isLoading"
                    />

                    <div class="flex items-center justify-between">
                        <Checkbox
                            v-model="form.remember"
                            color="primary"
                            label="Remember me"
                            :disabled="isLoading"
                        />

                        <NuxtLink
                            to="/forgot-password"
                            class="text-sm font-medium text-primary-500 hover:text-primary-600"
                        >
                            Forgot your password?
                        </NuxtLink>
                    </div>

                    <ErrorAlert
                        :error="error"
                        :dismissible="true"
                        @dismiss="error = ''"
                    />

                    <button
                        type="submit"
                        class="flex w-full items-center justify-center rounded-md bg-primary-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="isLoading"
                    >
                        <span>{{ isLoading ? 'Signing in...' : 'Log in' }}</span>
                    </button>
                </form>


                <!-- Footer -->
                <div class="mt-6 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Need support?
                        <a
                            href="#"
                            class="font-medium text-primary-500 hover:text-primary-600"
                        >
                            Contact us
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {LoginCredentials} from '~/types/auth'
import MaterialInput from '~/components/ui/MaterialInput.vue'
import MaterialButton from '~/components/ui/MaterialButton.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import ErrorAlert from '~/components/ui/ErrorAlert.vue'

definePageMeta({
    middleware: 'guest',
    layout: 'default',
})

const route = useRoute()
const { signIn } = useAuth()
const {showSuccess, showError} = useNotifications()

const isLoading = ref(false)

const form = reactive<LoginCredentials>({
    email: '',
    password: '',
    remember: false,
})

const error = ref<string>('')

const handleSubmit = async () => {
    isLoading.value = true
    error.value = ''

    try {
        const result = await signIn(form)

        if (result.success) {
            showSuccess('Successfully signed in!')
            // Redirect is handled by useAuth.signIn() - no need to redirect here
        } else {
            error.value = result.error || 'Login failed. Please try again.'
        }
    } catch {
        error.value = 'An unexpected error occurred. Please try again.'
        showError('Login failed. Please check your credentials.')
    } finally {
        isLoading.value = false
    }
}

useSeoMeta({
    title: 'Log in',
    description: 'Log in to your account',
})
</script>
