<template>
  <button
    :type="type"
    :class="buttonClasses"
    class="flex w-full items-center justify-center rounded-md px-4 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    @click="$emit('click')"
  >
    <slot name="icon" />
    <span>{{ text }}</span>
  </button>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'google', 'facebook'].includes(value),
    },
    type: {
      type: String,
      default: 'button',
    },
    text: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(['click'])

  const buttonClasses = computed(() => {
    const variants = {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
      google: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-500',
      facebook: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    }
    return variants[props.variant]
  })
</script>
