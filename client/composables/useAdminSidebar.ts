// composables/useAdminSidebar.ts
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Navigation configuration - centralized data structure with proper Heroicon names
const navigationConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/',
    icon: 'i-heroicons-home',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    to: '/inbox',
    icon: 'i-heroicons-inbox',
    badge: 4, // Notification count
  },
  {
    id: 'customers',
    label: 'Users',
    to: '/users',
    icon: 'i-heroicons-users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    defaultExpanded: true,
    children: [
      {
        id: 'general',
        label: 'General',
        to: '/admin',
        active: true, // Current active page
      },
      {
        id: 'members',
        label: 'Members',
        to: '/admin/members',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        to: '/admin/notifications',
      },
      {
        id: 'security',
        label: 'Security',
        to: '/admin/security',
      },
    ],
  },
]

// Profile dropdown configuration with proper Heroicon names
const profileMenuConfig = [
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
    type: 'divider' as const,
  },
  {
    id: 'logout',
    label: 'Sign out',
    icon: 'i-heroicons-arrow-right-start-on-rectangle',
    action: 'logout',
    external: true,
  },
]

// User configuration
const defaultUser = {
  name: 'Benjamin Canac',
  initials: 'BC',
}

export const useAdminSidebar = () => {
  // Reactive state
  const collapsed = ref(false)
  const settingsOpen = ref(true)
  const profileDropdownOpen = ref(false)
  const mobileMenuOpen = ref(false)
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

  // Computed properties - extracted business logic from template
  const isMobile = computed(() => windowWidth.value < 1024)

  const showLabels = computed(
    () => (!collapsed.value && !isMobile.value) || (isMobile.value && mobileMenuOpen.value)
  )

  const sidebarContainerClasses = computed(() => [
    // Mobile: Use fixed positioning that doesn't affect parent layout
    isMobile.value ? 'fixed top-0 left-0 z-50 h-screen' : 'relative',
    // Desktop: Participate in flex layout normally
    !isMobile.value && (collapsed.value ? 'w-20' : 'w-64'),
    'transition-all duration-300 ease-in-out',
  ])

  const sidebarContainerStyle = computed(() =>
    isMobile.value
      ? {
          transform: mobileMenuOpen.value ? 'translateX(0)' : 'translateX(-100%)',
          width: '16rem', // 256px
          height: '100vh',
        }
      : {}
  )

  const searchVisible = computed(
    () => (!collapsed.value && !isMobile.value) || (isMobile.value && mobileMenuOpen.value)
  )

  // Event handlers - organized and documented
  const handleResize = () => {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth

      // Close mobile menu when resizing to desktop
      if (!isMobile.value) {
        mobileMenuOpen.value = false
      }
    }
  }

  const toggleCollapse = () => {
    collapsed.value = !collapsed.value
    // Close settings submenu when collapsing
    if (collapsed.value) {
      settingsOpen.value = false
    }
    // Close profile dropdown when collapsing
    profileDropdownOpen.value = false
  }

  const toggleSettings = () => {
    // Don't allow settings toggle when collapsed on desktop
    if (collapsed.value && !isMobile.value) return
    settingsOpen.value = !settingsOpen.value
  }

  const toggleProfileDropdown = () => {
    profileDropdownOpen.value = !profileDropdownOpen.value
  }

  const toggleMobileSidebar = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  const closeMobileSidebar = () => {
    mobileMenuOpen.value = false
    profileDropdownOpen.value = false
  }

  const logout = () => {
    // Handle logout logic - could be extended to call auth service
    console.log('Logging out...')
    profileDropdownOpen.value = false
    closeMobileSidebar()
  }

  // Outside click handler - cleaned up logic
  const closeDropdown = (event: Event) => {
    const target = event.target as Element
    const sidebar = target.closest('.relative')
    const hamburger = target.closest('button')

    if (!sidebar && !hamburger) {
      profileDropdownOpen.value = false
    }

    // Close mobile menu when clicking outside (but not on hamburger)
    if (isMobile.value && !target.closest('[data-sidebar]') && !hamburger) {
      mobileMenuOpen.value = false
    }
  }

  // Keyboard handler
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      profileDropdownOpen.value = false
      mobileMenuOpen.value = false
    }
  }

  // Custom event handler for layout integration
  const handleToggleEvent = () => {
    toggleMobileSidebar()
  }

  // Lifecycle management - organized and documented
  onMounted(() => {
    if (typeof window !== 'undefined') {
      // Window event listeners
      window.addEventListener('resize', handleResize)
      document.addEventListener('click', closeDropdown)
      document.addEventListener('keydown', handleEscape)

      // Custom sidebar toggle event listener
      const sidebar = document.querySelector('[data-sidebar]')
      if (sidebar) {
        sidebar.addEventListener('toggleMobile', handleToggleEvent)
      }

      // Initial body scroll state
      document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : 'auto'
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      // Cleanup all event listeners
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', closeDropdown)
      document.removeEventListener('keydown', handleEscape)

      const sidebar = document.querySelector('[data-sidebar]')
      if (sidebar) {
        sidebar.removeEventListener('toggleMobile', handleToggleEvent)
      }

      // Reset body scroll
      document.body.style.overflow = 'auto'
    }
  })

  // Body scroll control when mobile menu state changes
  watch(mobileMenuOpen, isOpen => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    }
  })

  // Return reactive state and methods
  return {
    // Configuration
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

    // Computed classes and styles
    sidebarContainerClasses,
    sidebarContainerStyle,

    // Event handlers
    toggleCollapse,
    toggleSettings,
    toggleProfileDropdown,
    toggleMobileSidebar,
    closeMobileSidebar,
    logout,
  }
}
