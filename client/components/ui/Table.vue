<template>
  <div :class="wrapperClasses">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="relative"
    >
      <div
        class="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm"
      >
        <div class="flex items-center gap-2">
          <svg
            class="h-5 w-5 animate-spin text-primary-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="text-sm text-neutral-600">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table :class="tableClasses">
        <!-- Table header -->
        <thead
          v-if="columns && columns.length"
          class="border-b border-neutral-200 bg-neutral-50"
        >
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="getHeaderClasses(column)"
              @click="column.sortable ? handleSort(column.key) : undefined"
            >
              <div class="flex items-center gap-2">
                <span>{{ column.label || column.key }}</span>

                <!-- Sort indicator -->
                <div
                  v-if="column.sortable"
                  class="flex flex-col"
                >
                  <Icon
                    name="i-heroicons-chevron-up"
                    :class="getSortIconClasses(column.key, 'asc')"
                  />
                  <Icon
                    name="i-heroicons-chevron-down"
                    :class="getSortIconClasses(column.key, 'desc')"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Table body -->
        <tbody
          v-if="data && data.length"
          class="divide-y divide-neutral-200"
        >
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            :class="getRowClasses(row, rowIndex)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="getCellClasses(column)"
            >
              <!-- Custom cell content -->
              <slot
                :name="`${column.key}-cell`"
                :row="row"
                :column="column"
                :value="row[column.key]"
                :index="rowIndex"
              >
                <!-- Default cell content -->
                <span>{{ row[column.key] }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && (!data || data.length === 0)"
      class="py-12 text-center"
    >
      <div class="flex flex-col items-center gap-3">
        <!-- Empty state icon -->
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
          <Icon
            :name="emptyState?.icon || 'i-heroicons-document'"
            class="h-6 w-6 text-neutral-400"
          />
        </div>

        <!-- Empty state text -->
        <div>
          <h3 class="text-sm font-medium text-neutral-900">
            {{ emptyState?.label || 'No data available' }}
          </h3>
          <p
            v-if="emptyState?.description"
            class="mt-1 text-sm text-neutral-500"
          >
            {{ emptyState.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { TableProps, TableColumn } from '~/types/ui'
  import Icon from '~/components/ui/Icon.vue'

  const props = withDefaults(defineProps<TableProps>(), {
    data: () => [],
    columns: () => [],
    loading: false,
    class: '',
  })

  const emit = defineEmits<{
    sort: [column: string, direction: 'asc' | 'desc']
    'row-click': [row: any, index: number]
  }>()

  // State
  const sortColumn = ref<string | null>(null)
  const sortDirection = ref<'asc' | 'desc'>('asc')

  // Wrapper classes
  const wrapperClasses = computed(() => {
    const baseClasses = ['relative bg-white border border-neutral-200 rounded-lg overflow-hidden']

    const customClasses = props.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  })

  // Table classes
  const tableClasses = computed(() => ['min-w-full divide-y divide-neutral-200'].join(' '))

  // Header classes
  const getHeaderClasses = (column: TableColumn) => {
    const baseClasses = [
      'px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider',
    ]

    const interactiveClasses = []
    if (column.sortable) {
      interactiveClasses.push('cursor-pointer hover:bg-neutral-100 transition-colors duration-150')
    }

    const customClasses = column.headerClass || ''

    return [...baseClasses, ...interactiveClasses, customClasses].filter(Boolean).join(' ')
  }

  // Row classes
  const getRowClasses = (row: any, index: number) => {
    const baseClasses = ['hover:bg-neutral-50 transition-colors duration-150']

    return baseClasses.join(' ')
  }

  // Cell classes
  const getCellClasses = (column: TableColumn) => {
    const baseClasses = ['px-6 py-4 whitespace-nowrap text-sm text-neutral-900']

    const customClasses = column.class || ''

    return [...baseClasses, customClasses].filter(Boolean).join(' ')
  }

  // Sort icon classes
  const getSortIconClasses = (columnKey: string, direction: 'asc' | 'desc') => {
    const baseClasses = ['h-3 w-3 transition-colors duration-150']

    if (sortColumn.value === columnKey && sortDirection.value === direction) {
      baseClasses.push('text-primary-500')
    } else {
      baseClasses.push('text-neutral-300')
    }

    return baseClasses.join(' ')
  }

  // Event handlers
  const handleSort = (columnKey: string) => {
    if (sortColumn.value === columnKey) {
      // Toggle direction if same column
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      // New column, start with ascending
      sortColumn.value = columnKey
      sortDirection.value = 'asc'
    }

    emit('sort', columnKey, sortDirection.value)
  }

  const handleRowClick = (row: any, index: number) => {
    emit('row-click', row, index)
  }
</script>

<style scoped>
  /* Custom scrollbar for table overflow */
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }

  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
