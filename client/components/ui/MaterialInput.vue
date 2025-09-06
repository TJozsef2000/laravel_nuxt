<!-- components/UI/MaterialInput.vue -->
<template>
  <div class="relative mb-6">
    <input
      :id="id"
      :type="inputType"
      :value="modelValue"
      :class="inputClasses"
      :placeholder="isFocused ? placeholder : ''"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <label
      :for="id"
      :class="labelClasses"
    >
      {{ label }}{{ required ? ' *' : '' }}
    </label>
    <!-- Error message -->
    <p
      v-if="hasError && errorMessage"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ errorMessage }}
    </p>
    <button
      v-if="type === 'password'"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
      @click="togglePasswordVisibility"
    >
      <svg
        v-if="showPassword"
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <svg
        v-else
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: [String, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const isFocused = ref(false)
  const showPassword = ref(false)

  const inputType = computed(() => {
    if (props.type === 'password') {
      return showPassword.value ? 'text' : 'password'
    }
    return props.type
  })

  const hasValue = computed(() => props.modelValue.length > 0)
  const hasError = computed(() => {
    if (typeof props.error === 'boolean') {
      return props.error
    }
    return typeof props.error === 'string' && props.error.length > 0
  })

  const errorMessage = computed(() => {
    if (typeof props.error === 'string') {
      return props.error
    }
    return ''
  })

  const inputClasses = computed(() => {
    const baseClasses = 'peer w-full rounded-md border bg-white px-3 pb-3 pt-4 text-gray-900 outline-none transition-colors duration-200 dark:bg-gray-800 dark:text-gray-100'
    
    if (props.disabled) {
      return `${baseClasses} cursor-not-allowed opacity-50 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600`
    }
    
    if (hasError.value) {
      return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500`
    }
    
    if (isFocused.value) {
      return `${baseClasses} border-primary-500 focus:border-primary-500 focus:ring-primary-500`
    }
    
    return `${baseClasses} border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500`
  })

  const labelClasses = computed(() => {
    const baseClasses = 'pointer-events-none absolute left-3 top-[16px] origin-left px-1 transition-all duration-200'
    
    if (isFocused.value || hasValue.value) {
      if (hasError.value) {
        return `${baseClasses} text-xs -translate-y-6 scale-90 text-red-500 bg-white dark:bg-gray-800 dark:text-red-400`
      }
      return `${baseClasses} text-xs -translate-y-6 scale-90 text-primary-500 bg-white dark:bg-gray-800`
    }
    
    if (hasError.value) {
      return `${baseClasses} text-sm translate-y-0 scale-100 text-red-500 bg-transparent dark:text-red-400`
    }
    
    return `${baseClasses} text-sm translate-y-0 scale-100 text-gray-500 bg-transparent dark:text-gray-400`
  })

  const handleFocus = () => {
    isFocused.value = true
  }

  const handleBlur = () => {
    isFocused.value = false
  }

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
  }
</script>
