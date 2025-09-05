<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div
      v-if="$slots.header"
      :class="headerClasses"
    >
      <slot name="header" />
    </div>

    <!-- Body -->
    <div :class="bodyClasses">
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="$slots.footer"
      :class="footerClasses"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CardProps } from '~/types/ui'

  const props = withDefaults(defineProps<CardProps>(), {
    class: '',
    bodyClass: '',
    headerClass: '',
    footerClass: '',
  })

  // Check if slots are present
  const slots = useSlots()
  const hasHeader = computed(() => !!slots.header)
  const hasFooter = computed(() => !!slots.footer)

  // Card container classes
  const cardClasses = computed(() => {
    const baseClasses = [
      'bg-white dark:bg-gray-800',
      'border border-gray-200 dark:border-gray-700',
      'rounded-lg',
      'shadow-md',
      'overflow-hidden',
    ]

    const customClasses = props.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Header section classes
  const headerClasses = computed(() => {
    const baseClasses = [
      'px-6 py-4',
      'border-b border-gray-200 dark:border-gray-700',
      'bg-gray-50 dark:bg-gray-700/50',
    ]

    const customClasses = props.headerClass || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Body section classes
  const bodyClasses = computed(() => {
    const baseClasses = ['px-6 py-4']

    // Adjust padding if header/footer present
    const paddingAdjustments = []
    if (hasHeader.value) {
      paddingAdjustments.push('pt-4')
    }
    if (hasFooter.value) {
      paddingAdjustments.push('pb-4')
    }

    const customClasses = props.bodyClass || ''

    return [...baseClasses, ...paddingAdjustments, customClasses].filter(Boolean).join(' ')
  })

  // Footer section classes
  const footerClasses = computed(() => {
    const baseClasses = [
      'px-6 py-4',
      'border-t border-gray-200 dark:border-gray-700',
      'bg-gray-50 dark:bg-gray-700/50',
    ]

    const customClasses = props.footerClass || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })
</script>
