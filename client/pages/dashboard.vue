<template>
    <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="space-y-6">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Welcome back, {{ user?.name }}!
                        </h1>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Here's what's happening with your account today.
                        </p>
                    </div>
                    <div class="mt-4 sm:mt-0">
                        <Button
                            icon="i-heroicons-arrow-path"
                            variant="outline"
                            :loading="isRefreshing"
                            @click="refreshData"
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Account Info Card -->
                    <Card class="sm:col-span-2 lg:col-span-3">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Account Information
                                </h2>
                                <Badge
                                    :color="user?.email_verified_at ? 'success' : 'warning'"
                                    variant="subtle"
                                >
                                    {{ user?.email_verified_at ? 'Verified' : 'Unverified' }}
                                </Badge>
                            </div>
                        </template>

                        <div class="space-y-4">
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {{ user?.name }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Email address
                                    </dt>
                                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {{ user?.email }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Member since</dt>
                                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {{ formatDate(user?.created_at) }}
                                    </dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Last updated</dt>
                                    <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        {{ formatDate(user?.updated_at) }}
                                    </dd>
                                </div>
                            </div>

                            <div
                                v-if="!user?.email_verified_at"
                                class="mt-4 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20"
                            >
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg
                                            class="h-5 w-5 text-yellow-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div class="ml-3 flex-1">
                                        <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            Email not verified
                                        </h3>
                                        <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                                            Please verify your email address to access all features.
                                        </p>
                                        <div class="mt-4">
                                            <button
                                                class="rounded-md bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800 transition-colors duration-200 hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700"
                                                :disabled="isSendingVerification"
                                                @click="sendVerificationEmail"
                                            >
                                                {{ isSendingVerification ? 'Sending...' : 'Send verification email' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <!-- Activity Card -->
                    <Card>
                        <template #header>
                            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Activity</h2>
                        </template>

                        <div class="space-y-3">
                            <div class="flex items-center space-x-3">
                                <div class="flex-shrink-0">
                                    <div
                                        class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
                                    >
                                        <svg
                                            class="h-4 w-4 text-green-600 dark:text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Signed in</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="flex-shrink-0">
                                    <div
                                        class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
                                    >
                                        <svg
                                            class="h-4 w-4 text-primary-600 dark:text-primary-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Profile updated
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ formatDate(user?.updated_at) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {ApiError} from '~/types/errors'
import Card from '~/components/ui/Card.vue'
import Badge from '~/components/ui/Badge.vue'
import Button from '~/components/ui/Button.vue'

definePageMeta({
    middleware: 'auth',
})

const {user, refreshUser} = useAuth()
const {showSuccess, showError} = useNotifications()
const route = useRoute()

const isRefreshing = ref(false)
const isSendingVerification = ref(false)

// Handle email verification query parameters
onMounted(() => {
    const verified = route.query.verified
    const error = route.query.error

    if (verified === '1') {
        showSuccess('Email verified successfully! Welcome to your dashboard.')
        // Remove query parameters from URL
        navigateTo('/dashboard', {replace: true})
    } else if (verified === '0' && error === 'invalid') {
        showError('Email verification failed. Invalid or expired verification link.')
        // Remove query parameters from URL
        navigateTo('/dashboard', {replace: true})
    }
})

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const refreshData = async () => {
    isRefreshing.value = true
    try {
        const result = await refreshUser()
        if (result.success) {
            showSuccess('Account data refreshed successfully!')
        } else {
            showError(result.error || 'Failed to refresh data')
        }
    } catch {
        showError('Failed to refresh data')
    } finally {
        isRefreshing.value = false
    }
}

const sendVerificationEmail = async () => {
    isSendingVerification.value = true
    try {
        // This would need to be implemented based on your Laravel backend
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

useSeoMeta({
    title: 'Dashboard',
    description: 'Your account dashboard',
})
</script>
