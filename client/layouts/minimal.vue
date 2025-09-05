<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main content -->
    <main class="mx-auto max-w-7xl bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 dark:bg-gray-900">
      <slot />
    </main>

    <!-- Toast Notifications handled by global plugin -->
  </div>
</template>

<script setup lang="ts">
  // Toast notifications are handled by global plugin
</script>

<style scoped></style>
