<!-- components/ui/admin/AdminSidebar.vue -->
<template>
  <!-- Mobile Backdrop -->
  <div
    v-if="isMobile && mobileMenuOpen"
    class="fixed inset-0 z-40 bg-black bg-opacity-25 transition-opacity lg:hidden"
    @click="closeMobileSidebar"
  />

  <!-- Sidebar Container - Refactored with computed classes and styles -->
  <div
    :class="sidebarContainerClasses"
    :style="sidebarContainerStyle"
  >
    <!-- Actual Sidebar Content -->
    <div
      data-sidebar
      class="flex h-full w-full flex-col border-r border-gray-200 bg-white"
    >
      <!-- Header - Logo and Controls -->
      <div class="flex items-center justify-between border-b border-gray-200 p-4">
        <!-- Logo -->
        <div
          v-show="showLabels"
          class="flex items-center space-x-2"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <svg
              class="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
          </div>
          <span class="text-xl font-semibold">Nuxt</span>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center space-x-2">
          <!-- Mobile Close Button -->
          <button
            v-if="isMobile && mobileMenuOpen"
            class="rounded-md p-2 transition-colors duration-200 hover:bg-gray-100"
            aria-label="Close sidebar"
            @click="closeMobileSidebar"
          >
            <Icon
              name="i-heroicons-x-mark"
              size="md"
              class="text-gray-600"
            />
          </button>

          <!-- Desktop Collapse Button -->
          <button
            v-if="!isMobile"
            :class="collapsed ? 'mx-auto' : ''"
            class="rounded-md p-2 transition-colors duration-200 hover:bg-gray-100"
            aria-label="Toggle sidebar"
            @click="toggleCollapse"
          >
            <Icon
              name="i-heroicons-chevron-left"
              size="md"
              :class="collapseButtonClasses"
            />
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div
        v-show="searchVisible"
        class="border-b border-gray-200 p-4"
      >
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            class="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
            aria-label="Search navigation"
          />
          <Icon
            name="i-heroicons-magnifying-glass"
            size="md"
            class="absolute left-3 top-2.5 text-gray-400"
          />
        </div>
      </div>

      <!-- Navigation - Using reusable NavItem components -->
      <nav class="flex-1 space-y-2 p-4">
        <NavItem
          v-for="item in navigationConfig"
          :key="item.id"
          :item="item"
          :is-collapsed="collapsed"
          :is-mobile="isMobile"
          :mobile-menu-open="mobileMenuOpen"
          @close-mobile="closeMobileSidebar"
        />
      </nav>

      <!-- Profile Section - Using ProfileDropdown component -->
      <ProfileDropdown
        :user="defaultUser"
        :is-open="profileDropdownOpen"
        :is-collapsed="collapsed"
        :is-mobile="isMobile"
        :mobile-menu-open="mobileMenuOpen"
        :menu-items="profileMenuConfig"
        @toggle="toggleProfileDropdown"
        @logout="logout"
        @close-mobile="closeMobileSidebar"
      />
    </div>
  </div>
</template>

<!--
  Refactored AdminSidebar component following clean code principles:
  - Separation of concerns: Business logic moved to composable
  - DRY principle: Reusable NavItem and ProfileDropdown components
  - Single responsibility: Each component has a focused purpose
  - Maintainability: Centralized configuration and computed properties
-->
<script setup lang="ts">
  import { computed } from 'vue'
  import { useAdminSidebar } from '~/composables/useAdminSidebar'
  import NavItem from './NavItem.vue'
  import ProfileDropdown from './ProfileDropdown.vue'
  import Icon from '~/components/ui/Icon.vue'

  // Use composable for all sidebar logic and state management
  const {
    // Configuration data (centralized)
    navigationConfig,
    profileMenuConfig,
    defaultUser,

    // Reactive state
    collapsed,
    settingsOpen,
    profileDropdownOpen,
    mobileMenuOpen,
    isMobile,
    showLabels,
    searchVisible,

    // Computed styles and classes (business logic moved from template)
    sidebarContainerClasses,
    sidebarContainerStyle,

    // Event handlers (organized and documented)
    toggleCollapse,
    toggleSettings,
    toggleProfileDropdown,
    toggleMobileSidebar,
    closeMobileSidebar,
    logout,
  } = useAdminSidebar()

  // Computed property for collapse button classes to fix TypeScript issues
  const collapseButtonClasses = computed(
    () => `text-gray-600 transition-transform duration-300 ${collapsed.value ? 'rotate-180' : ''}`
  )
</script>
