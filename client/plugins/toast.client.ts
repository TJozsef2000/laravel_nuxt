import ToastContainer from "~/components/ui/ToastContainer.vue"
import {createApp, h} from "vue"

export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.client && !nuxtApp.$toastContainer) {
        let app: ReturnType<typeof createApp> | null = null
        let container: HTMLElement | null = null

        try {
            // Check if container already exists to prevent duplicates
            const existingContainer = document.getElementById("global-toast-container")
            if (existingContainer) {
                console.warn('Global toast container already exists, skipping initialization')
                return
            }

            // Create a DOM node for the container
            container = document.createElement("div")
            container.id = "global-toast-container"
            container.setAttribute('data-toast-container', 'true')
            document.body.appendChild(container)

            // Mount ToastContainer manually
            const vnode = h(ToastContainer)
            app = createApp(vnode)

            // Make sure the container can access Nuxt injections
            app.provide("nuxtApp", nuxtApp)
            app.mount(container)

            console.debug('Global toast container initialized successfully')

            // Cleanup function
            const cleanup = () => {
                try {
                    if (app && container && container.parentNode) {
                        app.unmount()
                        container.parentNode.removeChild(container)
                        console.debug('Global toast container cleaned up')
                    }
                } catch (cleanupError) {
                    console.warn('Error during toast container cleanup:', cleanupError)
                }
            }

            // Cleanup on browser close/refresh
            window.addEventListener('beforeunload', cleanup)

        } catch (error) {
            console.error('Failed to initialize global toast container:', error)

            // Cleanup on error
            if (app && container) {
                try {
                    app.unmount()
                    if (container.parentNode) {
                        container.parentNode.removeChild(container)
                    }
                } catch (cleanupError) {
                    console.warn('Error during error cleanup:', cleanupError)
                }
            }
        }
    }
})
