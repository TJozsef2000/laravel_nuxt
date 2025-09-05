<template>
  <div class="group flex items-center gap-3">
    <div class="relative flex items-center">
      <input
        :id="checkboxId"
        ref="inputRef"
        type="checkbox"
        :name="name"
        :value="value"
        :checked="isChecked"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Custom checkbox indicator -->
      <div :class="indicatorClasses">
        <svg
          v-if="isChecked"
          :class="checkIconClasses"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>

    <!-- Label -->
    <label
      v-if="$slots.default || label"
      :for="checkboxId"
      :class="labelClasses"
    >
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
  import type { CheckboxProps } from '~/types/ui'

  interface Props extends CheckboxProps {
    // eslint-disable-next-line vue/require-default-prop
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    color: 'primary',
    size: 'md',
    disabled: false,
    required: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean | any[]]
    change: [event: Event]
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
  }>()

  // Template refs
  const inputRef = ref<HTMLInputElement>()

  // Generate unique ID
  const checkboxId = ref(`checkbox-${Math.random().toString(36).substr(2, 9)}`)

  // State
  const isFocused = ref(false)

  // Computed checked state
  const isChecked = computed(() => {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value)
    }
    return Boolean(props.modelValue)
  })

  // Input classes (hidden native checkbox)
  const inputClasses = computed(() =>
    [
      'absolute inset-0 w-full h-full opacity-0 cursor-pointer peer',
      props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    ].join(' ')
  )

  // Custom indicator classes (Material Design)
  const indicatorClasses = computed(() => {
    const baseClasses = [
      'flex items-center justify-center',
      'border-2 rounded transition-all duration-200',
      'peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary-500',
      'pointer-events-none', // Prevent blocking clicks
    ]

    // Size classes
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      xl: 'w-8 h-8',
    }

    // Color and state classes (Material Design with orange accent)
    const stateClasses = []

    if (props.disabled) {
      stateClasses.push('bg-gray-100 border-gray-300 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600')
    } else if (isChecked.value) {
      // Checked state (Material Design style)
      stateClasses.push(
        'bg-primary-500 border-primary-500',
        'group-hover:bg-primary-600 group-hover:border-primary-600'
      )
    } else {
      // Unchecked state (Material Design style)
      stateClasses.push(
        'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600',
        'group-hover:border-primary-400',
        'peer-focus:border-primary-500'
      )
    }

    return [...baseClasses, sizeClasses[props.size], ...stateClasses].join(' ')
  })

  // Check icon classes (Material Design)
  const checkIconClasses = computed(() => {
    const baseClasses = ['text-white pointer-events-none']

    // Size-based icon sizing
    const iconSizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    }

    return [...baseClasses, iconSizeClasses[props.size]].join(' ')
  })

  // Label classes (Material Design)
  const labelClasses = computed(() => {
    const baseClasses = ['select-none cursor-pointer font-medium', 'transition-colors duration-200']

    // Size-based text sizing
    const textSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    }

    const stateClasses = []

    if (props.disabled) {
      stateClasses.push('text-gray-400 cursor-not-allowed')
    } else {
      stateClasses.push('text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100')
    }

    return [...baseClasses, textSizeClasses[props.size], ...stateClasses].join(' ')
  })

  // Event handlers
  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const checked = target.checked

    if (Array.isArray(props.modelValue)) {
      const newValue = [...props.modelValue]
      if (checked) {
        if (!newValue.includes(props.value)) {
          newValue.push(props.value)
        }
      } else {
        const index = newValue.indexOf(props.value)
        if (index > -1) {
          newValue.splice(index, 1)
        }
      }
      emit('update:modelValue', newValue)
    } else {
      emit('update:modelValue', checked)
    }

    emit('change', event)
  }

  const handleFocus = (event: FocusEvent) => {
    isFocused.value = true
    emit('focus', event)
  }

  const handleBlur = (event: FocusEvent) => {
    isFocused.value = false
    emit('blur', event)
  }

  // Public methods
  const focus = () => {
    inputRef.value?.focus()
  }

  const blur = () => {
    inputRef.value?.blur()
  }

  // Expose public methods
  defineExpose({
    focus,
    blur,
    inputRef,
  })
</script>

<style scoped>
  /* Ensure proper positioning for the custom indicator */
  .relative {
    position: relative;
  }
</style>
