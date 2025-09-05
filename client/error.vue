<template>
    <div class="flex min-h-screen items-center justify-center sm:px-6 lg:px-8">
        <div class="w-full max-w-md">
            <!-- Error Icon and Status -->
            <div class="mb-8 text-center">
                <div class="mx-auto mb-6">
                    <component
                        :is="errorIcon"
                        class="mx-auto h-16 w-16 text-red-500 sm:h-20 sm:w-20 dark:text-red-400"
                    />
                </div>

                <h1 class="mb-2 text-6xl font-bold text-gray-900 sm:text-7xl dark:text-white">
                    {{ error.statusCode }}
                </h1>

                <h2 class="mb-4 text-xl font-semibold text-gray-700 sm:text-2xl dark:text-gray-300">
                    {{ errorTitle }}
                </h2>

                <p class="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
                    {{ errorDescription }}
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
                <button
                    class="w-full rounded-lg bg-primary-600 px-4 py-3 text-lg font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    @click="handleError"
                >
                    <div class="flex items-center justify-center gap-2">
                        <ArrowPathIcon class="h-5 w-5"/>
                        Try Again
                    </div>
                </button>

                <button
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    @click="goHome"
                >
                    <div class="flex items-center justify-center gap-2">
                        <HomeIcon class="h-5 w-5"/>
                        Go to Homepage
                    </div>
                </button>

                <button
                    class="w-full rounded-lg px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    @click="goBack"
                >
                    <div class="flex items-center justify-center gap-2">
                        <ArrowLeftIcon class="h-5 w-5"/>
                        Go Back
                    </div>
                </button>
            </div>

            <!-- Additional Help -->
            <div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div class="text-center">
                    <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        Need help? Contact our support team
                    </p>

                    <div class="flex justify-center space-x-4">
                        <a
                            href="mailto:support@example.com"
                            class="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <EnvelopeIcon class="h-4 w-4"/>
                            Email Support
                        </a>

                        <a
                            href="/contact"
                            class="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <ChatBubbleLeftRightIcon class="h-4 w-4"/>
                            Live Chat
                        </a>
                    </div>
                </div>
            </div>

            <!-- Error Details (Development only) -->
            <div
                v-if="$config.public.dev && error.stack"
                class="mt-8 rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
            >
                <details class="text-sm">
                    <summary class="mb-2 cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                        Error Details (Development)
                    </summary>
                    <pre
                        class="overflow-x-auto whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-400"
                    >{{ error.stack }}</pre
                    >
                </details>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app'

// Heroicons (outline)
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    HomeIcon,
    LockClosedIcon,
    MagnifyingGlassCircleIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
    error: NuxtError
}>()

// Computed: Dynamic icon
const errorIcon = computed(() => {
    switch (props.error.statusCode) {
        case 404:
            return MagnifyingGlassCircleIcon
        case 403:
            return LockClosedIcon
        case 500:
            return ExclamationTriangleIcon
        default:
            return ExclamationCircleIcon
    }
})

const errorTitle = computed(() => {
    switch (props.error.statusCode) {
        case 404:
            return 'Page Not Found'
        case 403:
            return 'Access Forbidden'
        case 500:
            return 'Server Error'
        default:
            return 'Something went wrong'
    }
})

const errorDescription = computed(() => {
    switch (props.error.statusCode) {
        case 404:
            return "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL."
        case 403:
            return "You don't have permission to access this resource. Please check your credentials or contact support if you believe this is an error."
        case 500:
            return "We're experiencing some technical difficulties on our end. Our team has been notified and is working to fix the issue."
        default:
            return (
                props.error.statusMessage ||
                'An unexpected error occurred. Please try again or contact support if the problem persists.'
            )
    }
})

// Methods
const handleError = () => {
    clearError({redirect: '/'})
}

const goHome = () => {
    navigateTo('/')
}

const goBack = () => {
    if (import.meta.client && window.history.length > 1) {
        window.history.back()
    } else {
        navigateTo('/')
    }
}

useHead({
    title: `${props.error.statusCode} - ${errorTitle.value}`,
    meta: [
        {
            name: 'description',
            content: errorDescription.value,
        },
    ],
})

if (import.meta.dev) {
    console.error('Error page rendered:', props.error)
}
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    .space-y-4 > * + * {
        margin-top: 1rem;
    }
}
</style>
