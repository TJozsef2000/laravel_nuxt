<template>
    <div
        class="pointer-events-none fixed inset-0 z-50 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end sm:p-6"
        aria-live="assertive"
    >
        <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
            <TransitionGroup
                tag="div"
                enter-active-class="transform ease-out duration-300 transition"
                enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                move-class="transition-all duration-300"
                class="flex w-full flex-col items-center space-y-4 sm:items-end"
            >
                <Toast
                    v-for="toast in toasts"
                    :key="toast.id"
                    v-bind="toast"
                    @dismiss="removeToast"
                />
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import type {ToastContainer, ToastItem} from '~/types/toast'
import type {ToastColor} from '~/types/errors'
import Toast from '~/components/ui/Toast.vue'

const toasts = ref<ToastItem[]>([])

const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastItem = {
        id,
        timeout: 5000,
        showProgressBar: true,
        ...toast,
    }
    toasts.value.push(newToast)

    if (toasts.value.length > 5) {
        toasts.value.shift()
    }
    return id
}

const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) toasts.value.splice(index, 1)
}

const clearToasts = () => {
    toasts.value = []
}

const removeToastByType = (type: ToastColor) => {
    toasts.value = toasts.value.filter(t => t.type !== type)
}

// Register globally only once
const nuxtApp = useNuxtApp()
if (!nuxtApp.$toastContainer) {
    const toastContainer: ToastContainer = {
        addToast,
        removeToast,
        clearToasts,
        removeToastByType,
    }
    nuxtApp.provide("toastContainer", toastContainer)
}
</script>
