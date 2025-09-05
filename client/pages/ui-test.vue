<template>
  <div
    class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900"
  >
    <div class="w-full max-w-md space-y-8">
      <div class="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <!-- Header -->
        <div class="mb-8 text-center">
          <Icon
            name="i-heroicons-academic-cap"
            class="text-blue-500"
            size="lg"
          />
          <Icon
            name="i-heroicons-user"
            style="solid"
            size="sm"
          />
          <h2 class="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            UI Test - Orange Primary Colors
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Testing primary colors and theme switching
            <a
              href="#"
              class="font-medium text-primary-500 hover:text-primary-600"
            >
              Primary Link
            </a>
          </p>
        </div>

        <!-- Test buttons -->
        <div class="mb-8 space-y-4">
          <button
            class="flex w-full items-center justify-center rounded-md bg-primary-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span>Primary Button (bg-primary-500)</span>
          </button>
          <button
            class="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Primary 600
          </button>
          <button
            class="w-full rounded-md bg-success-500 px-4 py-2 text-white hover:bg-success-600"
          >
            Success Button
          </button>
          <button class="w-full rounded-md bg-error-500 px-4 py-2 text-white hover:bg-error-600">
            Error Button
          </button>
        </div>

        <!-- Login Form -->
        <form
          class="space-y-6"
          @submit.prevent="handleLogin"
        >
          <MaterialInput
            id="email"
            v-model="email"
            label="Email Address"
            type="email"
            :required="true"
          />

          <MaterialInput
            id="password"
            v-model="password"
            label="Password"
            type="password"
            :required="true"
          />

          <div class="text-right">
            <a
              href="#"
              class="text-sm font-medium text-primary-500 hover:text-primary-600"
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            class="flex w-full items-center justify-center rounded-md bg-primary-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span>Test Login Button</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">or</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="space-y-3">
          <MaterialButton
            variant="google"
            text="Continue with Google"
            @click="handleGoogleLogin"
          >
            <template #icon>
              <svg
                class="mr-3 h-5 w-5"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </template>
          </MaterialButton>

          <MaterialButton
            variant="facebook"
            text="Continue with Facebook"
            @click="handleFacebookLogin"
          >
            <template #icon>
              <svg
                class="mr-3 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </template>
          </MaterialButton>
        </div>

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
          <div class="mt-4 text-xs">
            <p class="text-gray-500 dark:text-gray-400">Visit: http://localhost:3002/ui-test</p>
            <p class="text-gray-500 dark:text-gray-400">
              Toggle theme using the switcher in navbar
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import MaterialButton from '~/components/ui/MaterialButton.vue'
  import MaterialInput from '~/components/ui/MaterialInput.vue'
  import Icon from '~/components/ui/Icon.vue'

  // Reactive data
  const email = ref('')
  const password = ref('')

  // Methods
  const handleLogin = () => {
    console.log('Login attempted with:', { email: email.value, password: password.value })
    // Add your login logic here
  }

  const handleGoogleLogin = () => {
    console.log('Google login clicked')
    // Add Google OAuth logic here
  }

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked')
    // Add Facebook OAuth logic here
  }

  // Meta for SEO
  useHead({
    title: 'Log in - Your App',
    meta: [{ name: 'description', content: 'Log in to your account' }],
  })
</script>
