<template>
  <div
    :class="alertClasses"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <Icon
        v-if="icon || defaultIcon"
        :name="icon || defaultIcon"
        :class="iconClasses"
      />

      <!-- Content -->
      <div class="min-w-0 flex-1">
        <!-- Title -->
        <h4
          v-if="title"
          :class="titleClasses"
        >
          {{ title }}
        </h4>

        <!-- Description -->
        <div
          v-if="description || $slots.default"
          :class="descriptionClasses"
        >
          <p v-if="description">{{ description }}</p>
          <slot v-else />
        </div>
      </div>

      <!-- Actions slot -->
      <div
        v-if="$slots.actions"
        class="ml-auto flex items-center gap-2"
      >
        <slot name="actions" />
      </div>

      <!-- Close button -->
      <Button
        v-if="closable"
        variant="ghost"
        size="sm"
        icon="i-heroicons-x-mark"
        :class="closeButtonClasses"
        @click="handleClose"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { AlertProps } from '~/types/ui'
  import Icon from '~/components/ui/Icon.vue'
  import Button from '~/components/ui/Button.vue'

  const props = withDefaults(defineProps<AlertProps>(), {
    variant: 'soft',
    color: 'info',
    closable: false,
  })

  const emit = defineEmits<{
    close: []
  }>()

  // Default icons for each color
  const defaultIcons = {
    primary: 'i-heroicons-information-circle',
    neutral: 'i-heroicons-information-circle',
    success: 'i-heroicons-check-circle',
    error: 'i-heroicons-x-circle',
    warning: 'i-heroicons-exclamation-triangle',
    info: 'i-heroicons-information-circle',
  }

  const defaultIcon = computed(() => defaultIcons[props.color])

  // Alert container classes
  const alertClasses = computed(() => {
    const baseClasses = ['relative p-4 rounded-lg border']

    // Color and variant combinations
    const colorVariantClasses = {
      primary: {
        solid: 'bg-primary-500 text-white border-primary-500',
        outline: 'bg-white text-primary-700 border-primary-500',
        soft: 'bg-primary-50 text-primary-700 border-primary-200',
        subtle: 'bg-primary-25 text-primary-600 border-primary-100',
      },
      neutral: {
        solid: 'bg-neutral-500 text-white border-neutral-500',
        outline: 'bg-white text-neutral-700 border-neutral-300',
        soft: 'bg-neutral-50 text-neutral-700 border-neutral-200',
        subtle: 'bg-neutral-25 text-neutral-600 border-neutral-100',
      },
      success: {
        solid: 'bg-success-500 text-white border-success-500',
        outline: 'bg-white text-success-700 border-success-500',
        soft: 'bg-success-50 text-success-700 border-success-200',
        subtle: 'bg-success-25 text-success-600 border-success-100',
      },
      error: {
        solid: 'bg-error-500 text-white border-error-500',
        outline: 'bg-white text-error-700 border-error-500',
        soft: 'bg-error-50 text-error-700 border-error-200',
        subtle: 'bg-error-25 text-error-600 border-error-100',
      },
      warning: {
        solid: 'bg-warning-500 text-white border-warning-500',
        outline: 'bg-white text-warning-700 border-warning-500',
        soft: 'bg-warning-50 text-warning-700 border-warning-200',
        subtle: 'bg-warning-25 text-warning-600 border-warning-100',
      },
      info: {
        solid: 'bg-info-500 text-white border-info-500',
        outline: 'bg-white text-info-700 border-info-500',
        soft: 'bg-info-50 text-info-700 border-info-200',
        subtle: 'bg-info-25 text-info-600 border-info-100',
      },
    }

    const customClasses = props.class || ''

    return [...baseClasses, colorVariantClasses[props.color][props.variant], customClasses]
      .filter(Boolean)
      .join(' ')
  })

  // Icon classes
  const iconClasses = computed(() => {
    const baseClasses = ['h-5 w-5 flex-shrink-0']

    // Color-specific icon colors
    const iconColorClasses = {
      primary: props.variant === 'solid' ? 'text-white' : 'text-primary-500',
      neutral: props.variant === 'solid' ? 'text-white' : 'text-neutral-500',
      success: props.variant === 'solid' ? 'text-white' : 'text-success-500',
      error: props.variant === 'solid' ? 'text-white' : 'text-error-500',
      warning: props.variant === 'solid' ? 'text-white' : 'text-warning-500',
      info: props.variant === 'solid' ? 'text-white' : 'text-info-500',
    }

    return [...baseClasses, iconColorClasses[props.color]].join(' ')
  })

  // Title classes
  const titleClasses = computed(() => {
    const baseClasses = ['font-medium text-sm']

    if (props.description || useSlots().default) {
      baseClasses.push('mb-1')
    }

    return baseClasses.join(' ')
  })

  // Description classes
  const descriptionClasses = computed(() => {
    const baseClasses = ['text-sm']

    if (props.variant === 'solid') {
      baseClasses.push('text-white/90')
    } else {
      const opacityClasses = {
        primary: 'text-primary-600',
        neutral: 'text-neutral-600',
        success: 'text-success-600',
        error: 'text-error-600',
        warning: 'text-warning-600',
        info: 'text-info-600',
      }
      baseClasses.push(opacityClasses[props.color])
    }

    return baseClasses.join(' ')
  })

  // Close button classes
  const closeButtonClasses = computed(() => {
    const baseClasses = ['flex-shrink-0', '-mr-1']

    if (props.variant === 'solid') {
      baseClasses.push('text-white hover:bg-white/20')
    } else {
      const hoverClasses = {
        primary: 'text-primary-500 hover:bg-primary-100',
        neutral: 'text-neutral-500 hover:bg-neutral-100',
        success: 'text-success-500 hover:bg-success-100',
        error: 'text-error-500 hover:bg-error-100',
        warning: 'text-warning-500 hover:bg-warning-100',
        info: 'text-info-500 hover:bg-info-100',
      }
      baseClasses.push(hoverClasses[props.color])
    }

    return baseClasses.join(' ')
  })

  // Handle close
  const handleClose = () => {
    emit('close')
  }
</script>
