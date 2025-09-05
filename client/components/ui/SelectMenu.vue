<template>
  <div
    class="relative"
    ref="selectRef"
  >
    <!-- Select trigger -->
    <button
      type="button"
      :class="triggerClasses"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <!-- Selected option icon -->
        <Icon
          v-if="selectedOption?.icon"
          :name="selectedOption.icon"
          class="h-4 w-4 flex-shrink-0"
        />

        <!-- Selected text or placeholder -->
        <span class="truncate">
          {{ selectedOption?.label || placeholder || 'Select option' }}
        </span>
      </div>

      <!-- Clear button (if clearable and has value) -->
      <Button
        v-if="clearable && hasValue"
        variant="ghost"
        size="xs"
        icon="i-heroicons-x-mark"
        class="-mr-1 flex-shrink-0"
        @click.stop="clearSelection"
      />

      <!-- Dropdown arrow -->
      <Icon
        name="i-heroicons-chevron-down"
        :class="arrowClasses"
      />
    </button>

    <!-- Dropdown menu -->
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
          role="listbox"
          :aria-multiselectable="multiple"
        >
          <!-- Search input (if searchable) -->
          <div
            v-if="searchable"
            class="border-b border-neutral-200 p-2"
          >
            <Input
              v-model="searchQuery"
              placeholder="Search options..."
              icon="i-heroicons-magnifying-glass"
              size="sm"
              @keydown.stop
            />
          </div>

          <!-- Options list -->
          <div class="max-h-60 overflow-y-auto py-1">
            <div
              v-for="(option, index) in filteredOptions"
              :key="option.value"
              :class="getOptionClasses(option, index)"
              :aria-selected="isSelected(option.value)"
              role="option"
              @click="selectOption(option)"
              @keydown="handleOptionKeydown($event, option)"
            >
              <div class="flex items-center gap-2">
                <!-- Option icon -->
                <Icon
                  v-if="option.icon"
                  :name="option.icon"
                  class="h-4 w-4 flex-shrink-0"
                />

                <!-- Option label -->
                <span class="flex-1 truncate">{{ option.label }}</span>

                <!-- Selection indicator -->
                <Icon
                  v-if="isSelected(option.value)"
                  name="i-heroicons-check"
                  class="h-4 w-4 flex-shrink-0 text-primary-500"
                />
              </div>
            </div>

            <!-- No options message -->
            <div
              v-if="filteredOptions.length === 0"
              class="px-3 py-2 text-center text-sm text-neutral-500"
            >
              {{ searchQuery ? 'No options found' : 'No options available' }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import type { SelectProps, SelectOption } from '~/types/ui'
  import Icon from '~/components/ui/Icon.vue'
  import Button from '~/components/ui/Button.vue'

  const props = withDefaults(defineProps<SelectProps>(), {
    options: () => [],
    size: 'md',
    disabled: false,
    multiple: false,
    searchable: false,
    clearable: false,
    placeholder: '',
    class: '',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: any]
    change: [value: any]
    open: []
    close: []
  }>()

  // Template refs
  const selectRef = ref<HTMLDivElement>()
  const menuRef = ref<HTMLDivElement>()

  // State
  const isOpen = ref(false)
  const searchQuery = ref('')
  const activeIndex = ref(-1)
  const menuPosition = ref({})

  // UI composable
  const { onClickOutside, isEscKey, isEnterKey, isSpaceKey } = useUI()

  // Computed properties
  const hasValue = computed(() => {
    if (props.multiple) {
      return Array.isArray(props.modelValue) && props.modelValue.length > 0
    }
    return props.modelValue != null && props.modelValue !== ''
  })

  const selectedOption = computed(() => {
    if (props.multiple) return null
    return props.options.find(option => option.value === props.modelValue) || null
  })

  const filteredOptions = computed(() => {
    if (!props.searchable || !searchQuery.value) {
      return props.options.filter(option => !option.disabled)
    }

    const query = searchQuery.value.toLowerCase()
    return props.options.filter(
      option => !option.disabled && option.label.toLowerCase().includes(query)
    )
  })

  // Classes
  const triggerClasses = computed(() => {
    const baseClasses = [
      'relative w-full flex items-center gap-2',
      'border border-neutral-300 rounded-md bg-white',
      'text-left transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    ]

    // Size classes
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-6 py-3 text-lg',
    }

    const stateClasses = []

    if (props.disabled) {
      stateClasses.push('bg-neutral-50 text-neutral-500 cursor-not-allowed')
    } else {
      stateClasses.push('hover:border-neutral-400 cursor-pointer')
    }

    const customClasses = props.class || ''

    return [...baseClasses, sizeClasses[props.size], ...stateClasses, customClasses]
      .filter(Boolean)
      .join(' ')
  })

  const arrowClasses = computed(() =>
    [
      'h-4 w-4 text-neutral-400 flex-shrink-0 transition-transform duration-200',
      isOpen.value ? 'transform rotate-180' : '',
    ]
      .filter(Boolean)
      .join(' ')
  )

  const menuClasses = computed(() =>
    [
      'absolute z-50 w-full min-w-48',
      'bg-white border border-neutral-200 rounded-lg shadow-lg',
      'focus:outline-none',
    ].join(' ')
  )

  // Option classes
  const getOptionClasses = (option: SelectOption, index: number) => {
    const baseClasses = [
      'px-3 py-2 cursor-pointer transition-colors duration-150',
      'hover:bg-neutral-50 focus:bg-neutral-50',
    ]

    const stateClasses = []

    if (option.disabled) {
      stateClasses.push('text-neutral-400 cursor-not-allowed')
    } else {
      stateClasses.push('text-neutral-700')

      if (activeIndex.value === index) {
        stateClasses.push('bg-neutral-50')
      }
    }

    return [...baseClasses, ...stateClasses].join(' ')
  }

  // Selection helpers
  const isSelected = (value: any) => {
    if (props.multiple) {
      return Array.isArray(props.modelValue) && props.modelValue.includes(value)
    }
    return props.modelValue === value
  }

  // Menu positioning
  const updateMenuPosition = () => {
    if (!selectRef.value || !menuRef.value) return

    const trigger = selectRef.value
    const menu = menuRef.value
    const triggerRect = trigger.getBoundingClientRect()

    let top = triggerRect.bottom + window.scrollY + 4
    let left = triggerRect.left + window.scrollX

    // Viewport boundary checks
    const viewportHeight = window.innerHeight
    const menuHeight = menu.offsetHeight

    if (top + menuHeight > viewportHeight) {
      top = triggerRect.top + window.scrollY - menuHeight - 4
    }

    menuPosition.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      minWidth: `${triggerRect.width}px`,
      zIndex: 50,
    }
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
    searchQuery.value = ''
    emit('open')

    nextTick(() => {
      updateMenuPosition()
    })
  }

  const close = () => {
    isOpen.value = false
    activeIndex.value = -1
    emit('close')
  }

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return

    let newValue

    if (props.multiple) {
      const currentValue = Array.isArray(props.modelValue) ? props.modelValue : []
      if (currentValue.includes(option.value)) {
        newValue = currentValue.filter(v => v !== option.value)
      } else {
        newValue = [...currentValue, option.value]
      }
    } else {
      newValue = option.value
      close()
    }

    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  const clearSelection = () => {
    const newValue = props.multiple ? [] : null
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }

  // Keyboard navigation
  const handleTriggerKeydown = (event: KeyboardEvent) => {
    if (isEnterKey(event) || isSpaceKey(event) || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen.value) {
        open()
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen.value) {
        open()
      }
    }
  }

  const handleOptionKeydown = (event: KeyboardEvent, option: SelectOption) => {
    if (isEnterKey(event) || isSpaceKey(event)) {
      event.preventDefault()
      selectOption(option)
    }
  }

  // Click outside to close
  let removeClickOutside: (() => void) | null = null

  watch(isOpen, open => {
    if (open) {
      nextTick(() => {
        if (selectRef.value) {
          removeClickOutside = onClickOutside(selectRef.value, close)
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
