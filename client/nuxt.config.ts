// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    typescript: {
        typeCheck: false
    },
    css: ['~/assets/css/main.css'],
    devtools: {enabled: true},

    modules: [
        '@nuxt/test-utils',
        '@nuxt/eslint',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxtjs/color-mode',
        'nuxt-auth-sanctum',
        '@nuxtjs/i18n',
    ],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    colorMode: {
        preference: 'light',
        fallback: 'light',
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        componentName: 'ColorScheme',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'nuxt-color-mode',
        dataValue: 'theme',
    },
    pinia: {
        storesDirs: ['./stores/**'],
    },

    // Runtime config for API base URL and locales
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
            defaultLocale: 'en',
            fallbackLocale: 'en',
        },
    },

    // Security headers
    nitro: {
        routeRules: {
            '/**': {
                headers: {
                    'X-Frame-Options': 'DENY',
                    'X-Content-Type-Options': 'nosniff',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
                },
            },
        },
    },

    // SSR settings
    ssr: false,

    // App settings
    app: {
        head: {
            title: 'Laravel Nuxt Auth',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {
                    name: 'description',
                    content: 'Secure authentication system built with Laravel Sanctum and Nuxt.js',
                },
            ],
        },
    },

  sanctum: {
    baseUrl: process.env.NUXT_PUBLIC_SANCTUM_BASE_URL || 'http://localhost:8000',
    origin: process.env.NUXT_PUBLIC_SANCTUM_ORIGIN || 'http://localhost:3000',
    mode: 'cookie', // Critical: Forces session-based authentication
    endpoints: {
      csrf: '/sanctum/csrf-cookie',
      login: 'api/auth/login',
      logout: 'api/auth/logout',
      user: 'api/auth/user',
    },
    csrf: {
      cookie: 'XSRF-TOKEN',
      header: 'X-XSRF-TOKEN',
    },
    redirect: {
      onLogin: '/dashboard',
      onLogout: '/login',
      onAuthOnly: '/login',
      onGuestOnly: '/',
    },
  },
})
