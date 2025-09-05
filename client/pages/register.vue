<template>
    <div
        class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900"
    >
        <div class="w-full max-w-md space-y-8">
            <div class="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                <!-- Header -->
                <div class="mb-8 text-center">
                    <h2 class="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Create your account
                    </h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?
                        <NuxtLink
                            to="/login"
                            class="font-medium text-primary-500 hover:text-primary-600"
                        >
                            Sign in here
                        </NuxtLink>
                    </p>
                </div>

                <!-- Registration Form -->
                <form
                    @submit.prevent="handleSubmit"
                    class="space-y-6"
                >
                    <MaterialInput
                        id="name"
                        label="Full Name"
                        type="text"
                        v-model="form.name"
                        :required="true"
                        :disabled="isLoading"
                    />

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

                    <MaterialInput
                        id="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        v-model="form.password_confirmation"
                        :required="true"
                        :disabled="isLoading"
                    />

                    <div class="flex items-start">
                        <Checkbox
                            color="primary"
                            v-model="form.terms"
                            label="I agree to the terms and conditions"
                            :disabled="isLoading"
                        />
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
                        <span>{{ isLoading ? 'Creating account...' : 'Create account' }}</span>
                    </button>
                </form>

                <!-- Footer -->
                <div class="mt-6 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        By creating an account, you agree to our
                        <NuxtLink
                            to="/terms"
                            class="font-medium text-primary-500 hover:text-primary-600"
                        >
                            Terms of Service
                        </NuxtLink>
                        and
                        <NuxtLink
                            to="/privacy"
                            class="font-medium text-primary-500 hover:text-primary-600"
                        >
                            Privacy Policy
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {RegisterData} from '~/types/auth'
import MaterialInput from '~/components/ui/MaterialInput.vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import ErrorAlert from '~/components/ui/ErrorAlert.vue'

definePageMeta({
    layout: 'default',
    middleware: 'guest',
})

const {signUp} = useAuth()
const {showSuccess, showError} = useNotifications()
const sanctumConfig = useSanctumConfig()

const isLoading = ref(false)

const form = reactive<RegisterData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
})

const error = ref<string>('')

const handleSubmit = async () => {
    isLoading.value = true
    error.value = ''

    try {
        const result = await signUp(form)

        if (result.success) {
            showSuccess('Account created successfully! Please check your email to verify your account.')
            // User is now automatically logged in, redirect to dashboard
            navigateTo(sanctumConfig.redirect.onLogin || '/dashboard')
        } else {
            error.value = result.error || 'Registration failed. Please try again.'
        }
    } catch {
        error.value = 'An unexpected error occurred. Please try again.'
        showError('Registration failed. Please try again.')
    } finally {
        isLoading.value = false
    }
}

useSeoMeta({
    title: 'Create Account',
    description: 'Create your account to get started',
})
</script>
