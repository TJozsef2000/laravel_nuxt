<template>
  <Menu
    as="div"
    class="relative"
    v-slot="{ open }"
  >
    <!-- Trigger -->
    <MenuButton
      ref="triggerRef"
      v-slot="{ open: isOpen }"
    >
      <slot name="trigger">
        <Button
          v-bind="triggerProps"
          :class="[triggerClass, isOpen && 'bg-neutral-100']"
          :disabled="disabled"
        >
          <slot />
        </Button>
      </slot>
    </MenuButton>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-1"
      >
        <MenuItems
          v-if="open"
          ref="menuRef"
          :class="menuClasses"
          :style="menuPosition"
        >
          <div
            v-if="items && items.length"
            class="py-1"
          >
            <template
              v-for="(item, index) in items"
              :key="index"
            >
              <!-- Separator -->
              <div
                v-if="item.separator"
                class="my-1 border-t border-neutral-200"
              />

              <!-- Menu Item -->
              <MenuItem
                v-else
                :disabled="item.disabled"
                v-slot="{ active, close }"
                as="template"
              >
                <component
                  :is="getItemComponent(item)"
                  :class="getItemClasses(item, active)"
                  :href="item.href"
                  :to="item.to"
                  :target="item.target"
                  @click="handleItemClick(item, close, $event)"
                >
                  <div class="flex items-center gap-2">
                    <Icon
                      v-if="item.icon"
                      :name="item.icon"
                      :class="['h-4 w-4 flex-shrink-0', item.iconClass].filter(Boolean).join(' ')"
                    />
                    <span class="flex-1 truncate">{{ item.label }}</span>
                    <div
                      v-if="item.shortcuts"
                      class="flex items-center gap-1"
                    >
                      <kbd
                        v-for="shortcut in item.shortcuts"
                        :key="shortcut"
                        class="rounded border bg-neutral-100 px-1 py-0.5 font-mono text-xs text-neutral-600"
                      >
                        {{ shortcut }}
                      </kbd>
                    </div>
                  </div>
                </component>
              </MenuItem>
            </template>
          </div>

          <!-- Custom content slot -->
          <div
            v-else-if="$slots.default"
            class="py-1"
          >
            <slot />
          </div>
        </MenuItems>
      </Transition>
    </Teleport>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import type { DropdownProps, DropdownItem } from '~/types/ui'
import Icon from '~/components/ui/Icon.vue'
import Button from '~/components/ui/Button.vue'

const props = withDefaults(defineProps<DropdownProps>(), {
  items: () => [],
  placement: 'bottom-start',
  disabled: false,
  class: '',
})

const emit = defineEmits<{
  open: []
  close: []
  select: [item: DropdownItem]
}>()

// Template refs
const menuRef = ref<HTMLDivElement>()
const triggerRef = ref<HTMLElement>()

// State
const menuPosition = ref({})
let activeTrigger: HTMLElement | null = null

// Menu positioning - called when menu opens or window changes
const updateMenuPosition = async () => {
  await nextTick()
  
  if (!triggerRef.value) {
    return
  }

  // Get the actual DOM element from Vue component instance
  const trigger = triggerRef.value.$el || triggerRef.value
  
  if (!trigger || typeof trigger.getBoundingClientRect !== 'function') {
    return
  }

  activeTrigger = trigger
  const triggerRect = trigger.getBoundingClientRect()

  // For position: absolute, use document coordinates (add scrollY/scrollX)
  let top = triggerRect.bottom + window.scrollY
  let left = triggerRect.left + window.scrollX

  // Handle different placements
  switch (props.placement) {
    case 'top-start':
      top = triggerRect.top + window.scrollY - 200 // Estimated menu height
      break
    case 'top-end':
      top = triggerRect.top + window.scrollY - 200 // Estimated menu height
      left = triggerRect.right + window.scrollX - 200 // Estimated menu width
      break
    case 'bottom-end':
      left = triggerRect.right + window.scrollX - 200 // Estimated menu width
      break
    case 'left-start':
      top = triggerRect.top + window.scrollY
      left = triggerRect.left + window.scrollX - 200 // Estimated menu width
      break
    case 'right-start':
      top = triggerRect.top + window.scrollY
      left = triggerRect.right + window.scrollX
      break
  }

  // Document boundary checks (use document coordinates)
  const documentWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth)
  const documentHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight)

  // Adjust for document boundaries
  if (left + 200 > documentWidth) { // Estimated menu width
    left = documentWidth - 200 - 8
  }
  if (left < 8) {
    left = 8
  }
  if (top + 200 > documentHeight) { // Estimated menu height
    top = triggerRect.top + window.scrollY - 200
  }
  if (top < window.scrollY + 8) {
    top = window.scrollY + 8
  }

  menuPosition.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 50,
    minWidth: `${Math.max(triggerRect.width, 120)}px`, // Minimum width
  }
}

// Handle window resize (but not scroll - dropdown should stay put when scrolling)
const handleWindowResize = () => {
  if (activeTrigger) {
    updateMenuPosition()
  }
}

// Setup event listeners - only listen to resize, not scroll
onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
})

// Menu classes
const menuClasses = computed(() => {
  const baseClasses = [
    'min-w-48 max-w-xs',
    'bg-white border border-neutral-200 rounded-lg shadow-lg',
    'focus:outline-none',
  ]

  const customClasses = props.class || ''

  return [...baseClasses, customClasses].filter(Boolean).join(' ')
})

// Trigger props for default button
const triggerProps = computed(() => ({
  variant: 'ghost' as const,
}))

const triggerClass = computed(() => '')

// Get component for menu item
const getItemComponent = (item: DropdownItem) => {
  if (item.to) return resolveComponent('NuxtLink')
  if (item.href) return 'a'
  return 'button'
}

// Get classes for menu item - now uses HeadlessUI's active state
const getItemClasses = (item: DropdownItem, active: boolean) => {
  const baseClasses = [
    'w-full px-3 py-2 text-left text-sm',
    'flex items-center gap-2',
    'transition-colors duration-150',
  ]

  const stateClasses = []

  if (item.disabled) {
    stateClasses.push('text-neutral-400 cursor-not-allowed')
  } else {
    stateClasses.push(
      'text-neutral-700 hover:bg-neutral-50 focus:bg-neutral-50',
      'cursor-pointer'
    )

    if (active) {
      stateClasses.push('bg-neutral-50')
    }
  }

  return [...baseClasses, ...stateClasses].join(' ')
}

// Event handlers
const handleItemClick = (item: DropdownItem, close: () => void, event: Event) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (item.click) {
    item.click()
  }

  emit('select', item)

  // Close menu if it's not a link (HeadlessUI handles this automatically for links)
  if (!item.to && !item.href) {
    close()
  }
}

// Watch for menu open state changes
watch(() => menuRef.value, (menuEl) => {
  if (menuEl) {
    // Menu is open, emit open event and update position
    emit('open')
    updateMenuPosition()
  } else {
    // Menu is closed, clear active trigger
    activeTrigger = null
    emit('close')
  }
})
</script>
