<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        :class="overlayClasses"
        @click="handleOverlayClick"
        @keydown.esc="handleEscapeKey"
        tabindex="-1"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="modelValue"
            ref="modalRef"
            :class="modalClasses"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
            :aria-describedby="descriptionId"
            @click.stop
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import type { ModalProps } from '~/types/ui'

  const props = withDefaults(defineProps<ModalProps>(), {
    modelValue: false,
    fullscreen: false,
    preventClose: false,
    overlayClass: '',
    class: '',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    close: []
    open: []
  }>()

  // Template refs
  const modalRef = ref<HTMLDivElement>()

  // Unique IDs for accessibility
  const titleId = ref(`modal-title-${Math.random().toString(36).substr(2, 9)}`)
  const descriptionId = ref(`modal-description-${Math.random().toString(36).substr(2, 9)}`)

  // Track the element that had focus before the modal opened
  const previousActiveElement = ref<HTMLElement | null>(null)

  // UI composable for focus management
  const { trapFocus, restoreFocus, isEscKey } = useUI()

  // Overlay classes
  const overlayClasses = computed(() => {
    const baseClasses = [
      'fixed inset-0 z-50',
      'bg-neutral-900/50 backdrop-blur-sm',
      'flex items-center justify-center',
      'p-4',
    ]

    if (props.fullscreen) {
      baseClasses.push('p-0')
    }

    const customOverlayClasses = props.overlayClass || ''

    return [...baseClasses, customOverlayClasses].filter(Boolean).join(' ')
  })

  // Modal container classes
  const modalClasses = computed(() => {
    const baseClasses = ['relative', 'w-full', 'max-h-full', 'overflow-y-auto', 'outline-none']

    if (props.fullscreen) {
      baseClasses.push('h-full')
    } else {
      baseClasses.push('max-w-lg', 'mx-auto', 'my-8')
    }

    const customClasses = props.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Handle overlay click (close modal if not prevented)
  const handleOverlayClick = () => {
    if (!props.preventClose) {
      closeModal()
    }
  }

  // Handle escape key
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (isEscKey(event) && !props.preventClose) {
      closeModal()
    }
  }

  // Close modal
  const closeModal = () => {
    emit('update:modelValue', false)
    emit('close')
  }

  // Open modal
  const openModal = () => {
    emit('update:modelValue', true)
    emit('open')
  }

  // Watch for modal open/close to manage focus and body scroll
  watch(
    () => props.modelValue,
    (isOpen, wasOpen) => {
      if (isOpen && !wasOpen) {
        // Modal is opening
        previousActiveElement.value = document.activeElement as HTMLElement

        // Prevent body scroll
        document.body.style.overflow = 'hidden'

        // Setup focus trap when modal content is rendered
        nextTick(() => {
          if (modalRef.value) {
            trapFocus(modalRef.value)
          }
        })
      } else if (!isOpen && wasOpen) {
        // Modal is closing
        // Restore body scroll
        document.body.style.overflow = ''

        // Restore focus to previous element
        restoreFocus(previousActiveElement.value)
        previousActiveElement.value = null
      }
    }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    if (props.modelValue) {
      document.body.style.overflow = ''
    }
  })

  // Public methods
  const open = () => openModal()
  const close = () => closeModal()
  const toggle = () => {
    if (props.modelValue) {
      closeModal()
    } else {
      openModal()
    }
  }

  // Expose public methods
  defineExpose({
    open,
    close,
    toggle,
    titleId,
    descriptionId,
  })
</script>

<style scoped>
  /* Ensure modal is above everything else */
  .modal-overlay {
    z-index: 9999;
  }

  /* Smooth backdrop blur */
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }

  /* Custom scrollbar for modal content */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
</style>
