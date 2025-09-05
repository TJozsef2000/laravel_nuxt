<template>
    <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="visible"
            :class="toastClasses"
            class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
            role="alert"
            :aria-live="type === 'error' ? 'assertive' : 'polite'"
        >
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <Icon
                            :name="iconName"
                            :class="iconClasses"
                            size="md"
                        />
                    </div>
                    <div class="ml-3 w-0 flex-1 pt-0.5">
                        <p class="text-sm font-medium text-gray-900">
                            {{ message }}
                        </p>
                        <div
                            v-if="actions?.length"
                            class="mt-3 flex space-x-7"
                        >
                            <button
                                v-for="action in actions"
                                :key="action.label"
                                type="button"
                                class="rounded-md bg-white text-sm font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                @click="action.click?.()"
                            >
                                {{ action.label }}
                            </button>
                        </div>
                    </div>
                    <div class="ml-4 flex flex-shrink-0">
                        <button
                            type="button"
                            class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            @click="dismiss"
                        >
                            <span class="sr-only">Close</span>
                            <Icon
                                name="i-heroicons-x-mark"
                                size="md"
                            />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Progress bar for timeout -->
            <div
                v-if="showProgressBar && timeout > 0"
                class="h-1 bg-gray-200"
            >
                <div
                    :class="progressBarClasses"
                    class="h-full transition-all ease-linear"
                    :style="{ width: `${progressPercentage}%` }"
                />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import type { ToastAction, ToastColor } from '~/types/errors'
import Icon from "~/components/ui/Icon.vue";

interface Props {
    id: string
    message: string
    type?: ToastColor
    icon?: string
    timeout?: number
    actions?: ToastAction[]
    showProgressBar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    timeout: 5000,
    showProgressBar: true,
})

const emit = defineEmits<{
    dismiss: [id: string]
}>()

const visible = ref(true)
const progressPercentage = ref(100)

let timeoutId: NodeJS.Timeout | null = null
let progressInterval: NodeJS.Timeout | null = null

const iconName = computed(() => {
    if (props.icon) return props.icon

    const iconMap: Record<ToastColor, string> = {
        success: 'i-heroicons-check-circle',
        error: 'i-heroicons-x-circle',
        warning: 'i-heroicons-exclamation-triangle',
        info: 'i-heroicons-information-circle',
        primary: 'i-heroicons-information-circle',
        secondary: 'i-heroicons-information-circle',
        neutral: 'i-heroicons-information-circle',
    }

    return iconMap[props.type]
})

const toastClasses = computed(() => {
    const baseClasses = 'relative'
    const colorMap: Record<ToastColor, string> = {
        success: 'border-l-4 border-green-400',
        error: 'border-l-4 border-red-400',
        warning: 'border-l-4 border-yellow-400',
        info: 'border-l-4 border-blue-400',
        primary: 'border-l-4 border-teal-400',
        secondary: 'border-l-4 border-gray-400',
        neutral: 'border-l-4 border-gray-400',
    }

    return `${baseClasses} ${colorMap[props.type]}`
})

const iconClasses = computed(() => {
    const colorMap: Record<ToastColor, string> = {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
        primary: 'text-teal-400',
        secondary: 'text-gray-400',
        neutral: 'text-gray-400',
    }

    return colorMap[props.type]
})

const progressBarClasses = computed(() => {
    const colorMap: Record<ToastColor, string> = {
        success: 'bg-green-400',
        error: 'bg-red-400',
        warning: 'bg-yellow-400',
        info: 'bg-blue-400',
        primary: 'bg-teal-400',
        secondary: 'bg-gray-400',
        neutral: 'bg-gray-400',
    }

    return colorMap[props.type]
})

const dismiss = () => {
    visible.value = false
    if (timeoutId) clearTimeout(timeoutId)
    if (progressInterval) clearInterval(progressInterval)

    // Wait for transition to complete before emitting dismiss
    setTimeout(() => {
        emit('dismiss', props.id)
    }, 100)
}

const startAutoHide = () => {
    if (props.timeout <= 0) return

    const startTime = Date.now()

    // Start progress bar animation
    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, props.timeout - elapsed)
        progressPercentage.value = (remaining / props.timeout) * 100

        if (remaining <= 0) {
            if (progressInterval) clearInterval(progressInterval)
        }
    }, 16) // ~60fps

    // Auto-dismiss after timeout
    timeoutId = setTimeout(() => {
        dismiss()
    }, props.timeout)
}

onMounted(() => {
    startAutoHide()
})

onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
    if (progressInterval) clearInterval(progressInterval)
})
</script>
