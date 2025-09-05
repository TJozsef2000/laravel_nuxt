<!-- components/ui/admin/ProfileDropdown.vue -->
<template>
  <div class="relative border-t border-gray-200 p-4">
    <!-- Profile Trigger -->
    <div
      :class="[triggerClasses, 'rounded-md p-2 hover:bg-gray-100']"
      @click="toggleDropdown"
    >
      <!-- Avatar -->
      <div
        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white"
      >
        {{ user.initials }}
      </div>

      <!-- User Info -->
      <div
        v-show="showLabels"
        class="min-w-0 flex-1 transition-opacity duration-300"
      >
        <p class="truncate text-sm font-medium text-gray-900">
          {{ user.name }}
        </p>
      </div>

      <!-- Dropdown Arrow -->
      <Icon
        v-show="showLabels"
        name="i-heroicons-chevron-up-down"
        size="sm"
        class="text-gray-400 transition-opacity duration-300"
      />

      <!-- Tooltip for collapsed state -->
      <div
        v-show="isCollapsed && !isMobile"
        class="pointer-events-none absolute left-full z-50 ml-6 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        {{ user.name }}
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-show="isOpen"
      :class="dropdownClasses"
    >
      <!-- Menu Items -->
      <template
        v-for="(item, index) in menuItems"
        :key="item.id || index"
      >
        <!-- Divider -->
        <hr
          v-if="item.type === 'divider'"
          class="my-1"
        />

        <!-- Menu Item -->
        <component
          :is="item.external ? 'a' : 'NuxtLink'"
          v-else
          :to="!item.external ? item.to : undefined"
          :href="item.external ? item.href : undefined"
          class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
          @click="handleItemClick(item)"
        >
          <div class="flex items-center space-x-2">
            <Icon
              v-if="item.icon"
              :name="item.icon"
              size="sm"
            />
            <span>{{ item.label }}</span>
          </div>
        </component>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import Icon from '~/components/ui/Icon.vue'

  // TypeScript interfaces for better type safety
  interface User {
    name: string
    initials: string
  }

  interface MenuItem {
    id?: string
    label?: string
    to?: string
    href?: string
    icon?: string
    action?: string
    external?: boolean
    type?: 'divider'
  }

  interface Props {
    user?: User
    isOpen?: boolean
    isCollapsed?: boolean
    isMobile?: boolean
    mobileMenuOpen?: boolean
    menuItems?: MenuItem[]
  }

  // Props with proper TypeScript types
  const props = withDefaults(defineProps<Props>(), {
    user: () => ({
      name: 'Benjamin Canac',
      initials: 'BC',
    }),
    isOpen: false,
    isCollapsed: false,
    isMobile: false,
    mobileMenuOpen: false,
    menuItems: () => [
      {
        id: 'profile',
        label: 'Profile',
        to: '/profile',
        icon: 'i-heroicons-user',
      },
      {
        id: 'settings',
        label: 'Settings',
        to: '/admin',
        icon: 'i-heroicons-cog-6-tooth',
      },
      {
        type: 'divider',
      },
      {
        id: 'logout',
        label: 'Sign out',
        icon: 'i-heroicons-arrow-right-start-on-rectangle',
        action: 'logout',
        external: true,
      },
    ],
  })

  // Emits with proper TypeScript types
  const emit = defineEmits<{
    toggle: []
    logout: []
    'close-mobile': []
  }>()

  // Computed properties
  const showLabels = computed(
    () => (!props.isCollapsed && !props.isMobile) || (props.isMobile && props.mobileMenuOpen)
  )

  const triggerClasses = computed(() => [
    'flex items-center cursor-pointer group',
    props.isCollapsed && !props.isMobile ? 'justify-center' : 'space-x-3',
  ])

  const dropdownClasses = computed(() => [
    'absolute bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 transition-all duration-200',
    props.isCollapsed && !props.isMobile ? 'bottom-16 left-20 w-48' : 'bottom-16 left-4 right-4',
  ])

  // Methods
  const toggleDropdown = () => {
    emit('toggle')
  }

  const handleItemClick = (item: MenuItem) => {
    if (item.action === 'logout') {
      emit('logout')
    }

    // Close mobile sidebar on any item click
    if (props.isMobile) {
      emit('close-mobile')
    }
  }
</script>
