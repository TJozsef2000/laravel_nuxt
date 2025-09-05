<!-- components/ui/admin/NavItem.vue -->
<template>
  <!-- Navigation Link -->
  <NuxtLink
    v-if="!item.children"
    :to="item.to"
    :class="linkClasses"
  >
    <!-- Icon container with optional badge -->
    <div
      v-if="item.badge && isCollapsed && !isMobile"
      class="relative"
    >
      <Icon :name="item.icon" />
      <span
        class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600"
      >
        {{ item.badge }}
      </span>
    </div>
    <Icon
      v-else
      :name="item.icon"
    />

    <!-- Label -->
    <span
      v-show="showLabels"
      class="transition-opacity duration-300"
    >
      {{ item.label }}
    </span>

    <!-- Badge for expanded state -->
    <span
      v-if="item.badge && showLabels"
      class="ml-auto rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600"
    >
      {{ item.badge }}
    </span>

    <!-- Tooltip for collapsed state -->
    <div
      v-show="isCollapsed && !isMobile"
      class="pointer-events-none absolute left-full z-50 ml-6 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      {{ item.label }}{{ item.badge ? ` (${item.badge})` : '' }}
    </div>
  </NuxtLink>

  <!-- Collapsible Section -->
  <div
    v-else
    class="space-y-1"
  >
    <!-- Parent Item -->
    <div
      :class="linkClasses"
      @click="toggleExpanded"
    >
      <Icon
        :name="item.icon"
        size="lg"
        class="flex-shrink-0"
      />
      <span
        v-show="showLabels"
        class="transition-opacity duration-300"
      >
        {{ item.label }}
      </span>

      <!-- Expand/Collapse Arrow -->
      <Icon
        v-show="showLabels"
        name="i-heroicons-chevron-right"
        size="sm"
        class="ml-auto transition-transform duration-300"
        :class="{ 'rotate-90': isExpanded }"
      />

      <!-- Tooltip for collapsed state -->
      <div
        v-show="isCollapsed && !isMobile"
        class="pointer-events-none absolute left-full z-50 ml-6 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- Sub Items -->
    <div
      v-show="isExpanded && showLabels"
      class="ml-8 space-y-1 transition-all duration-300"
    >
      <NuxtLink
        v-for="subItem in item.children"
        :key="subItem.to"
        :to="subItem.to"
        :class="subItemClasses(subItem)"
      >
        {{ subItem.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import Icon from '~/components/ui/Icon.vue'

  // Props
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    mobileMenuOpen: {
      type: Boolean,
      default: false,
    },
  })

  // Emits
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const emit = defineEmits(['close-mobile'])

  // Local state for expandable items
  const isExpanded = ref(props.item.defaultExpanded || false)

  // Computed properties for cleaner template logic
  const showLabels = computed(
    () => (!props.isCollapsed && !props.isMobile) || (props.isMobile && props.mobileMenuOpen)
  )

  const linkClasses = computed(() => [
    'flex items-center rounded-md hover:bg-gray-100 text-gray-700 group relative transition-colors',
    props.item.children ? 'cursor-pointer' : '',
    props.isCollapsed && !props.isMobile ? 'justify-center py-3 px-2' : 'space-x-3 px-3 py-2',
  ])

  // Methods
  const toggleExpanded = () => {
    // Don't allow toggle when collapsed on desktop
    if (props.isCollapsed && !props.isMobile) return
    isExpanded.value = !isExpanded.value
  }

  const subItemClasses = subItem => [
    'block px-3 py-2 rounded-md text-sm transition-colors',
    subItem.active
      ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
  ]
</script>
