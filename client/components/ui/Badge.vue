<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
  import type { BadgeProps } from '~/types/ui'

  const props = withDefaults(defineProps<BadgeProps>(), {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    class: '',
  })

  // Badge classes
  const badgeClasses = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium whitespace-nowrap',
      'transition-colors duration-200',
    ]

    // Size classes
    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs rounded',
      sm: 'px-2 py-0.5 text-xs rounded-md',
      md: 'px-2.5 py-1 text-sm rounded-md',
      lg: 'px-3 py-1.5 text-sm rounded-lg',
      xl: 'px-4 py-2 text-base rounded-lg',
    }

    // Color and variant combinations
    const colorVariantClasses = {
      primary: {
        solid: 'bg-primary-500 text-white',
        outline: 'border border-primary-500 text-primary-500 bg-transparent',
        soft: 'bg-primary-50 text-primary-600 border border-primary-200',
        subtle: 'bg-primary-50 text-primary-600',
      },
      neutral: {
        solid: 'bg-neutral-500 text-white',
        outline: 'border border-neutral-300 text-neutral-700 bg-transparent',
        soft: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
        subtle: 'bg-neutral-100 text-neutral-600',
      },
      success: {
        solid: 'bg-success-500 text-white',
        outline: 'border border-success-500 text-success-500 bg-transparent',
        soft: 'bg-success-50 text-success-600 border border-success-200',
        subtle: 'bg-success-50 text-success-600',
      },
      error: {
        solid: 'bg-error-500 text-white',
        outline: 'border border-error-500 text-error-500 bg-transparent',
        soft: 'bg-error-50 text-error-600 border border-error-200',
        subtle: 'bg-error-50 text-error-600',
      },
      warning: {
        solid: 'bg-warning-500 text-white',
        outline: 'border border-warning-500 text-warning-500 bg-transparent',
        soft: 'bg-warning-50 text-warning-600 border border-warning-200',
        subtle: 'bg-warning-50 text-warning-600',
      },
      info: {
        solid: 'bg-info-500 text-white',
        outline: 'border border-info-500 text-info-500 bg-transparent',
        soft: 'bg-info-50 text-info-600 border border-info-200',
        subtle: 'bg-info-50 text-info-600',
      },
    }

    const customClasses = props.class || ''

    return [
      ...baseClasses,
      sizeClasses[props.size],
      colorVariantClasses[props.color][props.variant],
      customClasses,
    ]
      .filter(Boolean)
      .join(' ')
  })
</script>
