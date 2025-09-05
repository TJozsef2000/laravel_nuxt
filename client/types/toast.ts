import type {ToastAction, ToastColor} from '~/types/errors'

export interface ToastItem {
    id: string
    message: string
    type: ToastColor
    icon?: string
    timeout?: number
    actions?: ToastAction[]
    showProgressBar?: boolean
}

export interface ToastContainer {
    addToast: (toast: Omit<ToastItem, 'id'>) => string
    removeToast: (id: string) => void
    clearToasts: () => void
    removeToastByType: (type: ToastColor) => void
}

declare module '#app' {
    interface NuxtApp {
        $toastContainer?: ToastContainer
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $toastContainer?: ToastContainer
    }
}
