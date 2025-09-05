<template>
  <div :class="avatarClasses">
    <!-- Image avatar -->
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      :class="imageClasses"
      @error="handleImageError"
      @load="handleImageLoad"
    />

    <!-- Fallback content -->
    <div
      v-else
      :class="fallbackClasses"
    >
      <slot>
        <!-- Default user icon -->
        <Icon
          name="i-heroicons-user"
          :class="iconClasses"
        />
      </slot>
    </div>

    <!-- Status indicator -->
    <div
      v-if="status"
      :class="statusClasses"
      :aria-label="`Status: ${status}`"
    />
  </div>
</template>

<script setup lang="ts">
  import type { AvatarProps } from '~/types/ui'
  import Icon from '~/components/ui/Icon.vue'

  interface Props extends AvatarProps {
    status?: 'online' | 'offline' | 'away' | 'busy'
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    alt: 'Avatar',
    class: '',
  })

  // State
  const imageError = ref(false)
  const imageLoaded = ref(false)

  // Avatar container classes
  const avatarClasses = computed(() => {
    const baseClasses = [
      'relative inline-flex items-center justify-center',
      'rounded-full overflow-hidden',
      'bg-neutral-100 text-neutral-600',
      'flex-shrink-0',
    ]

    // Size classes
    const sizeClasses = {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    }

    const customClasses = props.class || ''

    return [...baseClasses, sizeClasses[props.size], customClasses].filter(Boolean).join(' ')
  })

  // Image classes
  const imageClasses = computed(() =>
    [
      'h-full w-full object-cover',
      imageLoaded.value ? 'opacity-100' : 'opacity-0',
      'transition-opacity duration-200',
    ].join(' ')
  )

  // Fallback content classes
  const fallbackClasses = computed(() =>
    ['h-full w-full flex items-center justify-center', 'bg-neutral-200 text-neutral-500'].join(' ')
  )

  // Icon classes for default fallback
  const iconClasses = computed(() => {
    const iconSizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    }

    return ['text-neutral-400', iconSizeClasses[props.size]].join(' ')
  })

  // Status indicator classes
  const statusClasses = computed(() => {
    if (!props.status) return ''

    const baseClasses = ['absolute rounded-full border-2 border-white', 'bottom-0 right-0']

    // Size classes for status indicator
    const statusSizeClasses = {
      xs: 'h-2 w-2',
      sm: 'h-2.5 w-2.5',
      md: 'h-3 w-3',
      lg: 'h-3.5 w-3.5',
      xl: 'h-4 w-4',
    }

    // Status colors
    const statusColorClasses = {
      online: 'bg-success-500',
      offline: 'bg-neutral-400',
      away: 'bg-warning-500',
      busy: 'bg-error-500',
    }

    return [...baseClasses, statusSizeClasses[props.size], statusColorClasses[props.status]].join(
      ' '
    )
  })

  // Event handlers
  const handleImageError = () => {
    imageError.value = true
    imageLoaded.value = false
  }

  const handleImageLoad = () => {
    imageError.value = false
    imageLoaded.value = true
  }

  // Reset error state when src changes
  watch(
    () => props.src,
    () => {
      imageError.value = false
      imageLoaded.value = false
    }
  )
</script>
