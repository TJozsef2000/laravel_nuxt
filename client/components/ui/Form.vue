<template>
  <form
    :class="formClasses"
    @submit="handleSubmit"
    novalidate
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
  import type { FormProps } from '~/types/ui'

  const props = withDefaults(defineProps<FormProps>(), {
    class: '',
  })

  const emit = defineEmits<{
    submit: [data: any]
    error: [error: any]
  }>()

  // Form classes
  const formClasses = computed(() => {
    const baseClasses = ['space-y-4']
    const customClasses = props.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Handle form submission
  const handleSubmit = async (event: Event) => {
    event.preventDefault()

    try {
      // If schema validation is provided, validate the form
      if (props.schema && props.state) {
        const validatedData = await props.schema.parseAsync(props.state)
        emit('submit', validatedData)
      } else {
        // Emit the form data as-is if no schema
        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData.entries())
        emit('submit', data)
      }
    } catch (error) {
      emit('error', error)
    }
  }
</script>
