<script setup lang="ts">
  import { computed } from 'vue'
  import { allIcons } from '~/composables/heroicons'
  import type { IconProps, SizeVariant } from '~/types/ui'

  interface Props extends IconProps {
    strokeWidth?: number
    style?: 'outline' | 'solid'
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    strokeWidth: 2,
    style: 'outline',
  })

  // Convert "i-heroicons-academic-cap" → "AcademicCapIcon"
  const pascalCaseName = (str: string) =>
    str
      .replace(/^i-heroicons-/, '')
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('') + 'Icon'

  const iconComponent = computed(() => {
    const style = props.style || 'outline'
    const iconName = pascalCaseName(props.name)
    return allIcons[style]?.[iconName] || null
  })

  const iconClasses = computed(() => {
    const base = ['inline-block', 'flex-shrink-0']
    const sizes: Record<SizeVariant, string> = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    }

    const sizeClass = props.size.includes('h-')
      ? props.size
      : sizes[props.size as SizeVariant] || sizes.md

    return [...base, sizeClass, props.class || ''].join(' ')
  })
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :stroke-width="strokeWidth"
    :class="iconClasses"
    aria-hidden="true"
  />
  <span
    v-else
    class="text-red-500"
    >Icon not found</span
  >
</template>
