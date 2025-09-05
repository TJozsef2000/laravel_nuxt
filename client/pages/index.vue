<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="space-y-16 py-16">
      <!-- Hero Section -->
      <div class="px-4 text-center sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">
          Welcome to Our Platform
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
          A modern authentication system built with Laravel Sanctum and Nuxt.js. Secure, scalable,
          and ready for production.
        </p>
        <div class="mt-10 flex items-center justify-center gap-4">
          <div
            v-if="isGuest"
            class="flex flex-col gap-4 sm:flex-row"
          >
            <NuxtLink
              to="/register"
              class="inline-block rounded-md bg-primary-500 px-6 py-3 text-center font-medium text-white transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Get Started
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="inline-block rounded-md border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Sign In
            </NuxtLink>
          </div>
          <div
            v-else
            class="flex flex-col gap-4 sm:flex-row"
          >
            <NuxtLink
              to="/dashboard"
              class="inline-block rounded-md bg-primary-500 px-6 py-3 text-center font-medium text-white transition-all duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </NuxtLink>
            <NuxtLink
              to="/users"
              class="inline-block rounded-md border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Manage Users
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="mb-16 text-center">
            <h2
              class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100"
            >
              Features
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Everything you need for secure authentication
            </p>
          </div>

          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1 -->
            <div class="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500"
              >
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Secure Authentication
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Built with Laravel Sanctum for session-based authentication with CSRF protection.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500"
              >
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 2.25l-10.72 6.33a2.25 2.25 0 01-2.56 0L1.5 9M12 12.75h.008v.008H12V12.75z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Email Verification
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Automated email verification system to ensure user authenticity.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500"
              >
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591L6.659 5.341c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Password Reset
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Secure password reset functionality with time-limited tokens.
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500"
              >
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Rate Limiting
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Built-in rate limiting to prevent brute force attacks and abuse.
              </p>
            </div>

            <!-- Feature 5 -->
            <div class="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500"
              >
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
                TypeScript Ready
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Full TypeScript support with proper type definitions and validation.
              </p>
            </div>

            <!-- Feature 6 -->
            <div class="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500"
              >
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">Modern UI</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Beautiful, responsive interface built with Tailwind CSS.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
            <div class="mb-12 text-center">
              <h2
                class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100"
              >
                Built for Security & Performance
              </h2>
              <p class="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Enterprise-grade security features and best practices
              </p>
            </div>
            <div class="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-lg bg-primary-50 p-6 dark:bg-primary-900/20">
                <p class="text-3xl font-semibold text-primary-600 dark:text-primary-400">CSRF</p>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Protection</p>
              </div>
              <div class="rounded-lg bg-primary-50 p-6 dark:bg-primary-900/20">
                <p class="text-3xl font-semibold text-primary-600 dark:text-primary-400">Rate</p>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Limiting</p>
              </div>
              <div class="rounded-lg bg-primary-50 p-6 dark:bg-primary-900/20">
                <p class="text-3xl font-semibold text-primary-600 dark:text-primary-400">Email</p>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Verification</p>
              </div>
              <div class="rounded-lg bg-primary-50 p-6 dark:bg-primary-900/20">
                <p class="text-3xl font-semibold text-primary-600 dark:text-primary-400">Session</p>
                <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Based</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { isGuest } = useAuth()

  useSeoMeta({
    title: 'Laravel Nuxt Authentication',
    description: 'Secure authentication system built with Laravel Sanctum and Nuxt.js',
  })
</script>
