<template>
  <nav
    :class="paginationClasses"
    role="navigation"
    aria-label="Pagination"
  >
    <div class="flex items-center justify-between">
      <!-- Results info -->
      <div class="flex flex-1 justify-between sm:hidden">
        <Button
          v-if="currentPage > 1"
          variant="outline"
          size="sm"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </Button>
        <Button
          v-if="currentPage < totalPages"
          variant="outline"
          size="sm"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </Button>
      </div>

      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <!-- Results text -->
        <div>
          <p class="text-sm text-neutral-700">
            Showing
            <span class="font-medium">{{ startItem }}</span>
            to
            <span class="font-medium">{{ endItem }}</span>
            of
            <span class="font-medium">{{ total }}</span>
            results
          </p>
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center gap-1">
          <!-- First page -->
          <Button
            v-if="showFirst && currentPage > 1"
            variant="ghost"
            size="sm"
            icon="i-heroicons-chevron-double-left"
            @click="goToPage(1)"
            :disabled="currentPage === 1"
          />

          <!-- Previous page -->
          <Button
            variant="ghost"
            size="sm"
            icon="i-heroicons-chevron-left"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
          />

          <!-- Page numbers -->
          <div class="flex items-center gap-1">
            <!-- First page number (if not edge) -->
            <Button
              v-if="showEdges && pages[0] > 1"
              variant="ghost"
              size="sm"
              @click="goToPage(1)"
            >
              1
            </Button>

            <!-- Left ellipsis -->
            <span
              v-if="showEdges && pages[0] > 2"
              class="px-2 py-1 text-sm text-neutral-500"
            >
              ...
            </span>

            <!-- Page buttons -->
            <Button
              v-for="page in pages"
              :key="page"
              :variant="page === currentPage ? 'solid' : 'ghost'"
              :color="page === currentPage ? 'primary' : 'neutral'"
              size="sm"
              @click="goToPage(page)"
            >
              {{ page }}
            </Button>

            <!-- Right ellipsis -->
            <span
              v-if="showEdges && pages[pages.length - 1] < totalPages - 1"
              class="px-2 py-1 text-sm text-neutral-500"
            >
              ...
            </span>

            <!-- Last page number (if not edge) -->
            <Button
              v-if="showEdges && pages[pages.length - 1] < totalPages"
              variant="ghost"
              size="sm"
              @click="goToPage(totalPages)"
            >
              {{ totalPages }}
            </Button>
          </div>

          <!-- Next page -->
          <Button
            variant="ghost"
            size="sm"
            icon="i-heroicons-chevron-right"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          />

          <!-- Last page -->
          <Button
            v-if="showLast && currentPage < totalPages"
            variant="ghost"
            size="sm"
            icon="i-heroicons-chevron-double-right"
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import type { PaginationProps } from '~/types/ui'
  import Button from '~/components/ui/Button.vue'

  const props = withDefaults(defineProps<PaginationProps>(), {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
    showEdges: true,
    showFirst: false,
    showLast: false,
    class: '',
  })

  const emit = defineEmits<{
    'update:currentPage': [page: number]
    'page-change': [page: number]
  }>()

  // Computed properties
  const startItem = computed(() => {
    return Math.min((props.currentPage - 1) * props.perPage + 1, props.total)
  })

  const endItem = computed(() => {
    return Math.min(props.currentPage * props.perPage, props.total)
  })

  // Generate visible page numbers
  const pages = computed(() => {
    const maxVisible = 5
    const pages: number[] = []

    if (props.totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Complex logic for showing pages around current page
      const half = Math.floor(maxVisible / 2)
      let start = Math.max(1, props.currentPage - half)
      let end = Math.min(props.totalPages, props.currentPage + half)

      // Adjust if we're near the beginning or end
      if (end - start + 1 < maxVisible) {
        if (start === 1) {
          end = Math.min(props.totalPages, start + maxVisible - 1)
        } else if (end === props.totalPages) {
          start = Math.max(1, end - maxVisible + 1)
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  })

  // Pagination container classes
  const paginationClasses = computed(() => {
    const baseClasses = [
      'flex items-center justify-between',
      'px-4 py-3 bg-white border-t border-neutral-200',
    ]

    const customClasses = props.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Navigation methods
  const goToPage = (page: number) => {
    if (page < 1 || page > props.totalPages || page === props.currentPage) {
      return
    }

    emit('update:currentPage', page)
    emit('page-change', page)
  }

  // Keyboard navigation
  const handleKeydown = (event: KeyboardEvent, page: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToPage(page)
    }
  }
</script>
