<template>
  <div
    ref="dropdownRef"
    class="relative"
  >
    <!-- Trigger -->
    <div
      @click="toggle"
      @keydown="handleKeydown"
    >
      <slot name="trigger">
        <Button
          v-bind="triggerProps"
          :class="triggerClass"
          @click="toggle"
        >
          <slot />
        </Button>
      </slot>
    </div>

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
        <div
          v-if="isOpen"
          ref="menuRef"
          :class="menuClasses"
          :style="menuPosition"
          role="menu"
          :aria-labelledby="triggerId"
          @keydown="handleMenuKeydown"
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
              <component
                :is="getItemComponent(item)"
                v-else
                :class="getItemClasses(item, index)"
                :href="item.href"
                :to="item.to"
                :target="item.target"
                :disabled="item.disabled"
                :tabindex="item.disabled ? -1 : 0"
                role="menuitem"
                @click="handleItemClick(item, $event)"
                @keydown="handleItemKeydown($event, index)"
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
            </template>
          </div>

          <!-- Custom content slot -->
          <div
            v-else-if="$slots.default"
            class="py-1"
          >
            <slot />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
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
  const dropdownRef = ref<HTMLDivElement>()
  const menuRef = ref<HTMLDivElement>()

  // State
  const isOpen = ref(false)
  const activeIndex = ref(-1)
  const menuPosition = ref({})

  // Unique ID for accessibility
  const triggerId = ref(`dropdown-trigger-${Math.random().toString(36).substr(2, 9)}`)

  // UI composable
  const { trapFocus, onClickOutside, isEscKey, isEnterKey, isSpaceKey, isArrowKey } = useUI()

  // Menu positioning
  const updateMenuPosition = () => {
    if (!dropdownRef.value || !menuRef.value) return

    const trigger = dropdownRef.value
    const menu = menuRef.value
    const triggerRect = trigger.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    let top = triggerRect.bottom + window.scrollY
    let left = triggerRect.left + window.scrollX

    // Handle different placements
    switch (props.placement) {
      case 'top-start':
        top = triggerRect.top + window.scrollY - menuRect.height
        break
      case 'top-end':
        top = triggerRect.top + window.scrollY - menuRect.height
        left = triggerRect.right + window.scrollX - menuRect.width
        break
      case 'bottom-end':
        left = triggerRect.right + window.scrollX - menuRect.width
        break
      case 'left-start':
        top = triggerRect.top + window.scrollY
        left = triggerRect.left + window.scrollX - menuRect.width
        break
      case 'right-start':
        top = triggerRect.top + window.scrollY
        left = triggerRect.right + window.scrollX
        break
    }

    // Viewport boundary checks
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left + menuRect.width > viewportWidth) {
      left = viewportWidth - menuRect.width - 8
    }
    if (left < 8) {
      left = 8
    }
    if (top + menuRect.height > viewportHeight) {
      top = triggerRect.top + window.scrollY - menuRect.height
    }
    if (top < 8) {
      top = 8
    }

    menuPosition.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 50,
    }
  }

  // Menu classes
  const menuClasses = computed(() => {
    const baseClasses = [
      'absolute min-w-48 max-w-xs',
      'bg-white border border-neutral-200 rounded-lg shadow-lg',
      'focus:outline-none',
    ]

    const customClasses = props.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Trigger props for default button
  const triggerProps = computed(() => ({
    variant: 'ghost' as const,
    disabled: props.disabled,
  }))

  const triggerClass = computed(() => (isOpen.value ? 'bg-neutral-100' : ''))

  // Get component for menu item
  const getItemComponent = (item: DropdownItem) => {
    if (item.to) return resolveComponent('NuxtLink')
    if (item.href) return 'a'
    return 'button'
  }

  // Get classes for menu item
  const getItemClasses = (item: DropdownItem, index: number) => {
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

      if (activeIndex.value === index) {
        stateClasses.push('bg-neutral-50')
      }
    }

    return [...baseClasses, ...stateClasses].join(' ')
  }

  // Event handlers
  const toggle = () => {
    if (props.disabled) return

    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  const open = () => {
    isOpen.value = true
    activeIndex.value = -1
    emit('open')

    nextTick(() => {
      updateMenuPosition()
      if (menuRef.value) {
        trapFocus(menuRef.value)
      }
    })
  }

  const close = () => {
    isOpen.value = false
    activeIndex.value = -1
    emit('close')
  }

  const handleItemClick = (item: DropdownItem, event: Event) => {
    if (item.disabled) {
      event.preventDefault()
      return
    }

    if (item.click) {
      item.click()
    }

    emit('select', item)

    if (!item.to && !item.href) {
      close()
    }
  }

  // Keyboard navigation
  const handleKeydown = (event: KeyboardEvent) => {
    if (isEnterKey(event) || isSpaceKey(event)) {
      event.preventDefault()
      toggle()
    } else if (isArrowKey(event)) {
      event.preventDefault()
      if (!isOpen.value) {
        open()
      }
    }
  }

  const handleMenuKeydown = (event: KeyboardEvent) => {
    if (isEscKey(event)) {
      close()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      navigateItems(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      navigateItems(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      activeIndex.value = 0
    } else if (event.key === 'End') {
      event.preventDefault()
      activeIndex.value = (props.items?.length || 1) - 1
    }
  }

  const handleItemKeydown = (event: KeyboardEvent, index: number) => {
    if (isEnterKey(event) || isSpaceKey(event)) {
      event.preventDefault()
      const item = props.items?.[index]
      if (item) {
        handleItemClick(item, event)
      }
    }
  }

  const navigateItems = (direction: number) => {
    if (!props.items?.length) return

    let newIndex = activeIndex.value + direction

    // Skip separators and disabled items
    while (newIndex >= 0 && newIndex < props.items.length) {
      const item = props.items[newIndex]
      if (!item.separator && !item.disabled) {
        activeIndex.value = newIndex
        return
      }
      newIndex += direction
    }

    // Wrap around
    if (direction > 0 && newIndex >= props.items.length) {
      activeIndex.value = 0
    } else if (direction < 0 && newIndex < 0) {
      activeIndex.value = props.items.length - 1
    }
  }

  // Click outside to close
  let removeClickOutside: (() => void) | null = null

  watch(isOpen, open => {
    if (open) {
      nextTick(() => {
        if (dropdownRef.value) {
          removeClickOutside = onClickOutside(dropdownRef.value, close)
        }
      })
    } else {
      if (removeClickOutside) {
        removeClickOutside()
        removeClickOutside = null
      }
    }
  })

  // Cleanup
  onUnmounted(() => {
    if (removeClickOutside) {
      removeClickOutside()
    }
  })

  // Public methods
  defineExpose({
    open,
    close,
    toggle,
  })
</script>
