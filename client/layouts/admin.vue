<!-- layouts/admin.vue -->
<template>
  <div
    class="flex min-h-screen bg-gray-50"
    style="height: 100vh; overflow: hidden"
  >
    <!-- Sidebar (Single instance that handles both desktop and mobile) -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="flex w-full min-w-0 flex-1 flex-col">
      <!-- Header Tabs -->
      <div class="flex-shrink-0 border-b border-gray-200 bg-white px-4 pt-6 lg:px-8">
        <div class="mb-4 flex items-center justify-between">
          <!-- Mobile Hamburger + Navigation -->
          <div class="flex flex-1 items-center space-x-4">
            <!-- Mobile Hamburger Button -->
            <button
              class="-ml-2 rounded-md p-2 transition-colors hover:bg-gray-100 lg:hidden"
              @click="toggleMobileSidebar"
            >
              <svg
                class="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Navigation Tabs -->
          </div>

          <!-- Top Right Actions -->
          <div class="flex items-center space-x-4">
            <!-- Global Search -->
            <div class="hidden sm:block">
              <AdminGlobalSearch />
            </div>

            <!-- Language Switcher -->
            <LanguageSwitcher />

            <!-- Admin Notification Bell -->
            <AdminNotificationBell />

<!--            &lt;!&ndash; User Profile &ndash;&gt;-->
<!--            <div class="h-6 w-6 rounded-full bg-gray-300"></div>-->
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Toast Notifications handled by global plugin -->
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import AdminSidebar from '~/components/ui/admin/AdminSidebar.vue'
  import AdminNotificationBell from '~/components/admin/AdminNotificationBell.vue'
  import AdminGlobalSearch from '~/components/admin/GlobalSearch.vue'
  import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
  ref(null)
  const toggleMobileSidebar = () => {
    // Get the sidebar component and call its toggle method
    const sidebar = document.querySelector('[data-sidebar]')
    if (sidebar) {
      // Trigger the mobile sidebar toggle
      sidebar.dispatchEvent(new CustomEvent('toggleMobile'))
    }
  }
</script>
