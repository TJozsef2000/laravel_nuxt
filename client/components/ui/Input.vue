<template>
  <div class="relative">
    <div :class="inputWrapperClasses">
      <Icon
        v-if="icon && iconPosition === 'left'"
        :name="icon"
        :class="iconClasses"
      />

      <input
        ref="inputRef"
        :class="inputClasses"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        v-bind="$attrs"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <Icon
        v-if="icon && iconPosition === 'right'"
        :name="icon"
        :class="iconClasses"
      />
    </div>

    <!-- Error message -->
    <p
      v-if="error && errorMessage"
      :id="`${inputId}-error`"
      class="mt-1 text-sm text-error-500"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { InputProps } from '~/types/ui'
  import Icon from '~/components/ui/Icon.vue'

  interface Props extends InputProps {
    errorMessage?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    iconPosition: 'left',
    size: 'md',
    disabled: false,
    readonly: false,
    required: false,
    error: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    input: [event: Event]
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
  }>()

  // Generate unique ID for accessibility
  const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

  // Template refs
  const inputRef = ref<HTMLInputElement>()

  // Focus management
  const isFocused = ref(false)

  // Input wrapper classes
  const inputWrapperClasses = computed(() => {
    const baseClasses = [
      'relative flex items-center',
      'border border-neutral-300 dark:border-neutral-600 rounded-md',
      'transition-all duration-200',
      'focus-within:ring-2 focus-within:ring-offset-0',
    ]

    // State classes
    const stateClasses = []

    if (props.error) {
      stateClasses.push(
        'border-error-500',
        'focus-within:border-error-500',
        'focus-within:ring-error-500'
      )
    } else {
      stateClasses.push('focus-within:border-primary-500', 'focus-within:ring-primary-500')
    }

    if (props.disabled) {
      stateClasses.push('bg-neutral-50 dark:bg-neutral-800', 'cursor-not-allowed')
    } else {
      stateClasses.push(
        'bg-white dark:bg-neutral-900',
        'hover:border-neutral-400 dark:hover:border-neutral-600'
      )
    }

    return [...baseClasses, ...stateClasses].join(' ')
  })

  // Input field classes
  const inputClasses = computed(() => {
    const baseClasses = [
      'flex-1 bg-transparent border-0 outline-none',
      'text-neutral-900 dark:text-neutral-100',
      'placeholder-neutral-400 dark:placeholder-neutral-500',
      'disabled:cursor-not-allowed disabled:text-neutral-500',
    ]

    // Size classes
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-6 py-3 text-lg',
    }

    // Adjust padding for icons
    let paddingClass = sizeClasses[props.size]
    if (props.icon) {
      if (props.iconPosition === 'left') {
        paddingClass = paddingClass.replace('px-', 'pl-0 pr-')
      } else {
        paddingClass = paddingClass.replace('px-', 'pl-').replace('pr-', 'pr-0')
      }
    }

    const customClasses = props.class || ''

    return [...baseClasses, paddingClass, customClasses].filter(Boolean).join(' ')
  })

  // Icon classes
  const iconClasses = computed(() => {
    const baseClasses = ['text-neutral-400', 'pointer-events-none']

    // Size-based positioning
    const positionClasses = {
      xs: props.iconPosition === 'left' ? 'ml-2 mr-1' : 'ml-1 mr-2',
      sm: props.iconPosition === 'left' ? 'ml-2.5 mr-1.5' : 'ml-1.5 mr-2.5',
      md: props.iconPosition === 'left' ? 'ml-3 mr-2' : 'ml-2 mr-3',
      lg: props.iconPosition === 'left' ? 'ml-4 mr-2.5' : 'ml-2.5 mr-4',
      xl: props.iconPosition === 'left' ? 'ml-6 mr-3' : 'ml-3 mr-6',
    }

    // Icon size based on input size
    const iconSizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    }

    return [...baseClasses, positionClasses[props.size], iconSizes[props.size]].join(' ')
  })

  // Event handlers
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
    emit('input', event)
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

  const select = () => {
    inputRef.value?.select()
  }

  // Expose public methods
  defineExpose({
    focus,
    blur,
    select,
    inputRef,
  })
</script>

<style scoped>
  /* Remove browser default focus styles since we handle focus with ring */
  input:focus {
    outline: none;
    box-shadow: none;
  }

  /* Ensure consistent height across different input types */
  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  /* Number input spinner removal */
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
