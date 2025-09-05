<template>
  <div :class="fieldClasses">
    <!-- Label -->
    <label
      v-if="label"
      :for="fieldId"
      :class="labelClasses"
    >
      {{ label }}
      <span
        v-if="required"
        class="ml-1 text-error-500"
        >*</span
      >
    </label>

    <!-- Description -->
    <p
      v-if="description"
      :class="descriptionClasses"
    >
      {{ description }}
    </p>

    <!-- Input slot -->
    <div class="relative">
      <slot
        :field-id="fieldId"
        :has-error="hasError"
      />
    </div>

    <!-- Error message -->
    <p
      v-if="hasError"
      :class="errorClasses"
    >
      {{ error }}
    </p>

    <!-- Hint -->
    <p
      v-if="hint && !hasError"
      :class="hintClasses"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { FormFieldProps } from '~/types/ui'

  const props = withDefaults(defineProps<FormFieldProps>(), {
    required: false,
    class: '',
  })

  // Generate unique field ID
  const fieldId = ref(`field-${Math.random().toString(36).substr(2, 9)}`)

  // Check if there's an error
  const hasError = computed(() => !!props.error)

  // Field container classes
  const fieldClasses = computed(() => {
    const baseClasses = ['space-y-2']
    const customClasses = props.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Label classes
  const labelClasses = computed(() => {
    const baseClasses = ['block text-sm font-medium text-neutral-700']

    return baseClasses.join(' ')
  })

  // Description classes
  const descriptionClasses = computed(() => {
    return 'text-sm text-neutral-500'
  })

  // Error message classes
  const errorClasses = computed(() => {
    return 'text-sm text-error-500'
  })

  // Hint classes
  const hintClasses = computed(() => {
    return 'text-sm text-neutral-500'
  })
</script>
