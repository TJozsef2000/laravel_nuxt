<template>
  <component
    :is="component"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    :href="href"
    :target="target"
    :to="to"
    v-bind="linkProps"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="button-spinner"
    >
      <svg
        class="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>

    <Icon
      v-if="icon && iconPosition === 'left' && !loading"
      :name="icon"
      class="button-icon-left"
    />

    <span
      v-if="$slots.default || label"
      class="button-content"
    >
      <slot>{{ label }}</slot>
    </span>

    <Icon
      v-if="icon && iconPosition === 'right' && !loading"
      :name="icon"
      class="button-icon-right"
    />
  </component>
</template>

<script setup lang="ts">
  import type { ButtonProps } from '~/types/ui'
  import Icon from '~/components/ui/Icon.vue'

  interface Props extends ButtonProps {
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    iconPosition: 'left',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  // Determine the component type
  const component = computed(() => {
    if (props.to) return resolveComponent('NuxtLink')
    if (props.href) return 'a'
    return 'button'
  })

  // Link props for NuxtLink or anchor
  const linkProps = computed(() => {
    if (props.to) {
      return { to: props.to }
    }
    if (props.href) {
      return {
        href: props.href,
        ...(props.target && { target: props.target }),
      }
    }
    return {}
  })

  // Generate button classes
  const buttonClasses = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ]

    // Size classes
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs rounded',
      sm: 'px-2.5 py-1.5 text-sm rounded-md',
      md: 'px-3 py-2 text-sm rounded-md',
      lg: 'px-4 py-2.5 text-base rounded-lg',
      xl: 'px-6 py-3 text-lg rounded-lg',
    }

    // Color and variant classes
    const colorVariantClasses = {
      primary: {
        solid:
          'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-primary-300',
        outline:
          'border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300',
        ghost:
          'text-primary-500 bg-transparent hover:bg-primary-50 focus:ring-primary-500 disabled:text-primary-300',
        soft: 'bg-primary-50 text-primary-600 hover:bg-primary-100 focus:ring-primary-500 disabled:bg-primary-25 disabled:text-primary-300',
        subtle:
          'text-primary-600 bg-transparent hover:text-primary-700 hover:bg-primary-50 disabled:text-primary-300',
      },
      neutral: {
        solid:
          'bg-neutral-500 text-white hover:bg-neutral-600 focus:ring-neutral-500 disabled:bg-neutral-300',
        outline:
          'border border-neutral-300 text-neutral-700 bg-transparent hover:bg-neutral-50 focus:ring-neutral-500 disabled:border-neutral-200 disabled:text-neutral-400',
        ghost:
          'text-neutral-700 bg-transparent hover:bg-neutral-100 focus:ring-neutral-500 disabled:text-neutral-400',
        soft: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-500 disabled:bg-neutral-50 disabled:text-neutral-400',
        subtle:
          'text-neutral-600 bg-transparent hover:text-neutral-700 hover:bg-neutral-50 disabled:text-neutral-400',
      },
      success: {
        solid:
          'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 disabled:bg-success-300',
        outline:
          'border border-success-500 text-success-500 bg-transparent hover:bg-success-50 focus:ring-success-500 disabled:border-success-300 disabled:text-success-300',
        ghost:
          'text-success-500 bg-transparent hover:bg-success-50 focus:ring-success-500 disabled:text-success-300',
        soft: 'bg-success-50 text-success-600 hover:bg-success-100 focus:ring-success-500 disabled:bg-success-25 disabled:text-success-300',
        subtle:
          'text-success-600 bg-transparent hover:text-success-700 hover:bg-success-50 disabled:text-success-300',
      },
      error: {
        solid:
          'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 disabled:bg-error-300',
        outline:
          'border border-error-500 text-error-500 bg-transparent hover:bg-error-50 focus:ring-error-500 disabled:border-error-300 disabled:text-error-300',
        ghost:
          'text-error-500 bg-transparent hover:bg-error-50 focus:ring-error-500 disabled:text-error-300',
        soft: 'bg-error-50 text-error-600 hover:bg-error-100 focus:ring-error-500 disabled:bg-error-25 disabled:text-error-300',
        subtle:
          'text-error-600 bg-transparent hover:text-error-700 hover:bg-error-50 disabled:text-error-300',
      },
      warning: {
        solid:
          'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 disabled:bg-warning-300',
        outline:
          'border border-warning-500 text-warning-500 bg-transparent hover:bg-warning-50 focus:ring-warning-500 disabled:border-warning-300 disabled:text-warning-300',
        ghost:
          'text-warning-500 bg-transparent hover:bg-warning-50 focus:ring-warning-500 disabled:text-warning-300',
        soft: 'bg-warning-50 text-warning-600 hover:bg-warning-100 focus:ring-warning-500 disabled:bg-warning-25 disabled:text-warning-300',
        subtle:
          'text-warning-600 bg-transparent hover:text-warning-700 hover:bg-warning-50 disabled:text-warning-300',
      },
      info: {
        solid: 'bg-info-500 text-white hover:bg-info-600 focus:ring-info-500 disabled:bg-info-300',
        outline:
          'border border-info-500 text-info-500 bg-transparent hover:bg-info-50 focus:ring-info-500 disabled:border-info-300 disabled:text-info-300',
        ghost:
          'text-info-500 bg-transparent hover:bg-info-50 focus:ring-info-500 disabled:text-info-300',
        soft: 'bg-info-50 text-info-600 hover:bg-info-100 focus:ring-info-500 disabled:bg-info-25 disabled:text-info-300',
        subtle:
          'text-info-600 bg-transparent hover:text-info-700 hover:bg-info-50 disabled:text-info-300',
      },
    }

    // Block width
    const blockClass = props.block ? 'w-full' : ''

    // Custom classes
    const customClasses = props.class || ''

    return [
      ...baseClasses,
      sizeClasses[props.size],
      colorVariantClasses[props.color][props.variant],
      blockClass,
      customClasses,
    ]
      .filter(Boolean)
      .join(' ')
  })

  // Handle click events
  const handleClick = (event: MouseEvent) => {
    if (props.disabled || props.loading) {
      event.preventDefault()
      return
    }
    emit('click', event)
  }
</script>
