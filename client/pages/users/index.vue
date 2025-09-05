<template>
  <div class="space-y-6">
    <!--    &lt;!&ndash; Header &ndash;&gt;-->
    <!--    <div class="flex items-center justify-between">-->
    <!--      <div>-->
    <!--        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>-->
    <!--        <p class="text-gray-600 dark:text-gray-400">Manage users and their permissions</p>-->
    <!--      </div>-->
    <!--      <UButton-->
    <!--        icon="i-heroicons-plus"-->
    <!--        size="lg"-->
    <!--        color="primary"-->
    <!--        @click="navigateTo('/users/create')"-->
    <!--      >-->
    <!--        Add User-->
    <!--      </UButton>-->
    <!--    </div>-->

    <!--    &lt;!&ndash; Statistics Cards &ndash;&gt;-->
    <!--    <div-->
    <!--      v-if="statistics"-->
    <!--      class="grid grid-cols-1 gap-4 md:grid-cols-4"-->
    <!--    >-->
    <!--      <div-->
    <!--        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"-->
    <!--      >-->
    <!--        <div class="flex items-center">-->
    <!--          <div class="rounded-full bg-blue-100 p-2 dark:bg-blue-900">-->
    <!--            <UIcon-->
    <!--              name="i-heroicons-users"-->
    <!--              class="h-6 w-6 text-blue-600 dark:text-blue-400"-->
    <!--            />-->
    <!--          </div>-->
    <!--          <div class="ml-4">-->
    <!--            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>-->
    <!--            <p class="text-2xl font-bold text-gray-900 dark:text-white">-->
    <!--              {{ statistics.total_users }}-->
    <!--            </p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <div-->
    <!--        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"-->
    <!--      >-->
    <!--        <div class="flex items-center">-->
    <!--          <div class="rounded-full bg-green-100 p-2 dark:bg-green-900">-->
    <!--            <UIcon-->
    <!--              name="i-heroicons-check-circle"-->
    <!--              class="h-6 w-6 text-green-600 dark:text-green-400"-->
    <!--            />-->
    <!--          </div>-->
    <!--          <div class="ml-4">-->
    <!--            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Verified</p>-->
    <!--            <p class="text-2xl font-bold text-gray-900 dark:text-white">-->
    <!--              {{ statistics.verified_users }}-->
    <!--            </p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <div-->
    <!--        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"-->
    <!--      >-->
    <!--        <div class="flex items-center">-->
    <!--          <div class="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">-->
    <!--            <UIcon-->
    <!--              name="i-heroicons-exclamation-triangle"-->
    <!--              class="h-6 w-6 text-yellow-600 dark:text-yellow-400"-->
    <!--            />-->
    <!--          </div>-->
    <!--          <div class="ml-4">-->
    <!--            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Unverified</p>-->
    <!--            <p class="text-2xl font-bold text-gray-900 dark:text-white">-->
    <!--              {{ statistics.unverified_users }}-->
    <!--            </p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <div-->
    <!--        class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"-->
    <!--      >-->
    <!--        <div class="flex items-center">-->
    <!--          <div class="rounded-full bg-purple-100 p-2 dark:bg-purple-900">-->
    <!--            <UIcon-->
    <!--              name="i-heroicons-clock"-->
    <!--              class="h-6 w-6 text-purple-600 dark:text-purple-400"-->
    <!--            />-->
    <!--          </div>-->
    <!--          <div class="ml-4">-->
    <!--            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Recent (7 days)</p>-->
    <!--            <p class="text-2xl font-bold text-gray-900 dark:text-white">-->
    <!--              {{ statistics.recent_users }}-->
    <!--            </p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    &lt;!&ndash; Filters &ndash;&gt;-->
    <!--    <UCard>-->
    <!--      <template #header>-->
    <!--        <h3 class="text-lg font-medium">Filters</h3>-->
    <!--      </template>-->

    <!--      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">-->
    <!--        <UFormField label="Search">-->
    <!--          <UInput-->
    <!--            v-model="filters.search"-->
    <!--            placeholder="Search by name or email..."-->
    <!--            :debounce="500"-->
    <!--            @update:model-value="applyFilters"-->
    <!--          />-->
    <!--        </UFormField>-->

    <!--        <UFormField label="Verification Status">-->
    <!--          <USelect-->
    <!--            v-model="filters.filter_verified"-->
    <!--            :options="verificationOptions"-->
    <!--            placeholder="All users"-->
    <!--            @update:model-value="applyFilters"-->
    <!--          />-->
    <!--        </UFormField>-->

    <!--        <UFormField label="Sort By">-->
    <!--          <USelect-->
    <!--            v-model="filters.sort_by"-->
    <!--            :options="sortOptions"-->
    <!--            @update:model-value="applyFilters"-->
    <!--          />-->
    <!--        </UFormField>-->

    <!--        <UFormField label="Sort Order">-->
    <!--          <USelect-->
    <!--            v-model="filters.sort_order"-->
    <!--            :options="orderOptions"-->
    <!--            @update:model-value="applyFilters"-->
    <!--          />-->
    <!--        </UFormField>-->
    <!--      </div>-->

    <!--      <template #footer>-->
    <!--        <div class="flex items-center justify-between">-->
    <!--          <UButton-->
    <!--            variant="ghost"-->
    <!--            color="neutral"-->
    <!--            @click="clearFilters"-->
    <!--          >-->
    <!--            Clear Filters-->
    <!--          </UButton>-->
    <!--          <div class="flex items-center gap-2">-->
    <!--            <span class="text-sm text-gray-600 dark:text-gray-400">Per page:</span>-->
    <!--            <USelect-->
    <!--              v-model="filters.per_page"-->
    <!--              :options="perPageOptions"-->
    <!--              @update:model-value="applyFilters"-->
    <!--            />-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </UCard>-->

    <!--    &lt;!&ndash; Users Table &ndash;&gt;-->
    <!--    <UCard>-->
    <!--      <template #header>-->
    <!--        <div class="flex items-center justify-between">-->
    <!--          <h3 class="text-lg font-medium">Users</h3>-->
    <!--          <div-->
    <!--            v-if="pagination"-->
    <!--            class="text-sm text-gray-600 dark:text-gray-400"-->
    <!--          >-->
    <!--            Showing-->
    <!--            {{ (pagination.current_page - 1) * pagination.per_page + 1 }} to-->
    <!--            {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}-->
    <!--            of {{ pagination.total }} users-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </template>-->

    <!--      <UTable-->
    <!--        :data="users as User[]"-->
    <!--        :columns="columns"-->
    <!--        :loading="isLoading"-->
    <!--        :empty-state="{-->
    <!--          icon: 'i-heroicons-users',-->
    <!--          label: 'No users found',-->
    <!--          description: 'No users match your current filters.',-->
    <!--        }"-->
    <!--      >-->
    <!--        <template #email-cell="{ row }">-->
    <!--          <div class="flex items-center gap-2">-->
    <!--            <span>{{ row.original.email }}</span>-->
    <!--            <UBadge-->
    <!--              v-if="row.original.email_verified_at"-->
    <!--              color="success"-->
    <!--              variant="soft"-->
    <!--              size="xs"-->
    <!--            >-->
    <!--              Verified-->
    <!--            </UBadge>-->
    <!--            <UBadge-->
    <!--              v-else-->
    <!--              color="warning"-->
    <!--              variant="soft"-->
    <!--              size="xs"-->
    <!--            >-->
    <!--              Unverified-->
    <!--            </UBadge>-->
    <!--          </div>-->
    <!--        </template>-->

    <!--        <template #created_at-cell="{ row }">-->
    <!--          <span class="text-sm text-gray-600 dark:text-gray-400">-->
    <!--            {{ formatDate(row.original.created_at) }}-->
    <!--          </span>-->
    <!--        </template>-->

    <!--        <template #actions-cell="{ row }">-->
    <!--          <div class="flex items-center gap-1">-->
    <!--            <UButton-->
    <!--              icon="i-heroicons-eye"-->
    <!--              variant="ghost"-->
    <!--              color="info"-->
    <!--              size="xs"-->
    <!--              @click="viewUser(row.original.id)"-->
    <!--            />-->
    <!--            <UButton-->
    <!--              icon="i-heroicons-pencil"-->
    <!--              variant="ghost"-->
    <!--              color="warning"-->
    <!--              size="xs"-->
    <!--              @click="editUser(row.original.id)"-->
    <!--            />-->
    <!--            <UButton-->
    <!--              :icon="-->
    <!--                row.original.email_verified_at-->
    <!--                  ? 'i-heroicons-shield-exclamation'-->
    <!--                  : 'i-heroicons-shield-check'-->
    <!--              "-->
    <!--              variant="ghost"-->
    <!--              :color="row.original.email_verified_at ? 'warning' : 'success'"-->
    <!--              size="xs"-->
    <!--              :loading="toggleLoading === row.original.id"-->
    <!--              @click="toggleVerification(row.original)"-->
    <!--            />-->
    <!--            <UButton-->
    <!--              icon="i-heroicons-trash"-->
    <!--              variant="ghost"-->
    <!--              color="error"-->
    <!--              size="xs"-->
    <!--              :disabled="row.original.id === currentAuthUser?.id"-->
    <!--              @click="confirmDelete(row.original)"-->
    <!--            />-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </UTable>-->

    <!--      &lt;!&ndash; Pagination &ndash;&gt;-->
    <!--      <template #footer>-->
    <!--        <div-->
    <!--          v-if="pagination && pagination.last_page > 1"-->
    <!--          class="flex justify-center"-->
    <!--        >-->
    <!--          <UPagination-->
    <!--            :page-count="pagination.last_page"-->
    <!--            :total="pagination.total"-->
    <!--            :model-value="pagination.current_page"-->
    <!--            @update:model-value="changePage"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </UCard>-->

    <!--    &lt;!&ndash; Delete Confirmation Modal &ndash;&gt;-->
    <!--    <UModal v-model="showDeleteModal">-->
    <!--      <UCard>-->
    <!--        <template #header>-->
    <!--          <h3 class="text-lg font-medium">Confirm Delete</h3>-->
    <!--        </template>-->

    <!--        <div class="space-y-4">-->
    <!--          <p>-->
    <!--            Are you sure you want to delete-->
    <!--            <strong>{{ userToDelete?.name }}</strong-->
    <!--            >?-->
    <!--          </p>-->
    <!--          <p class="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone.</p>-->
    <!--        </div>-->

    <!--        <template #footer>-->
    <!--          <div class="flex justify-end gap-2">-->
    <!--            <UButton-->
    <!--              variant="ghost"-->
    <!--              color="neutral"-->
    <!--              @click="showDeleteModal = false"-->
    <!--            >-->
    <!--              Cancel-->
    <!--            </UButton>-->
    <!--            <UButton-->
    <!--              color="error"-->
    <!--              :loading="deleteLoading"-->
    <!--              @click="handleDelete"-->
    <!--            >-->
    <!--              Delete User-->
    <!--            </UButton>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </UCard>-->
    <!--    </UModal>-->
  </div>
</template>

<!--<script setup lang="ts">-->
<!--  // import type { TableColumn } from '@nuxt/ui'-->
<!--  import type { User } from '~/types/auth'-->
<!--  import type { UserFilters, UserStatistics, PaginationData } from '~/types/user'-->
<!--  import type {TableColumn} from "~/types/ui";-->

<!--  // Page meta-->
<!--  definePageMeta({-->
<!--    middleware: 'auth',-->
<!--    layout: 'default',-->
<!--  })-->

<!--  // Composables-->
<!--  const { user: currentAuthUser } = useAuth()-->
<!--  const {-->
<!--    users,-->
<!--    pagination,-->
<!--    statistics,-->
<!--    isLoading,-->
<!--    fetchUsers,-->
<!--    fetchStatistics,-->
<!--    deleteUser,-->
<!--    toggleEmailVerification,-->
<!--  } = useUsers()-->
<!--  const { showSuccess, showError } = useNotifications()-->

<!--  // Reactive state-->
<!--  const filters = reactive<UserFilters>({-->
<!--    search: '',-->
<!--    filter_verified: undefined,-->
<!--    sort_by: 'created_at',-->
<!--    sort_order: 'desc',-->
<!--    per_page: 15,-->
<!--    page: 1,-->
<!--  })-->

<!--  const showDeleteModal = ref(false)-->
<!--  const userToDelete = ref<User | null>(null)-->
<!--  const deleteLoading = ref(false)-->
<!--  const toggleLoading = ref<number | null>(null)-->

<!--  const columns: TableColumn<User>[] = [-->
<!--    {-->
<!--      accessorKey: 'id',-->
<!--      header: 'ID',-->
<!--    },-->
<!--    {-->
<!--      accessorKey: 'name',-->
<!--      header: 'Name',-->
<!--    },-->
<!--    {-->
<!--      accessorKey: 'email',-->
<!--      header: 'Email',-->
<!--    },-->
<!--    {-->
<!--      accessorKey: 'created_at',-->
<!--      header: 'Created',-->
<!--    },-->
<!--    {-->
<!--      id: 'actions',-->
<!--      header: 'Actions',-->
<!--    },-->
<!--  ]-->

<!--  // Filter options-->
<!--  const verificationOptions = [-->
<!--    { label: 'All users', value: undefined },-->
<!--    { label: 'Verified only', value: true },-->
<!--    { label: 'Unverified only', value: false },-->
<!--  ]-->

<!--  const sortOptions = [-->
<!--    { label: 'Name', value: 'name' },-->
<!--    { label: 'Email', value: 'email' },-->
<!--    { label: 'Created Date', value: 'created_at' },-->
<!--    { label: 'Updated Date', value: 'updated_at' },-->
<!--  ]-->

<!--  const orderOptions = [-->
<!--    { label: 'Descending', value: 'desc' },-->
<!--    { label: 'Ascending', value: 'asc' },-->
<!--  ]-->

<!--  const perPageOptions = [-->
<!--    { label: '10', value: 10 },-->
<!--    { label: '15', value: 15 },-->
<!--    { label: '25', value: 25 },-->
<!--    { label: '50', value: 50 },-->
<!--  ]-->

<!--  // Methods-->
<!--  const applyFilters = async () => {-->
<!--    filters.page = 1 // Reset to first page when filtering-->
<!--    await fetchUsers(filters)-->
<!--  }-->

<!--  const clearFilters = async () => {-->
<!--    Object.assign(filters, {-->
<!--      search: '',-->
<!--      filter_verified: undefined,-->
<!--      sort_by: 'created_at',-->
<!--      sort_order: 'desc',-->
<!--      per_page: 15,-->
<!--      page: 1,-->
<!--    })-->
<!--    await fetchUsers(filters)-->
<!--  }-->

<!--  const changePage = async (page: number) => {-->
<!--    filters.page = page-->
<!--    await fetchUsers(filters)-->
<!--  }-->

<!--  const viewUser = (id: number) => {-->
<!--    navigateTo(`/users/${id}`)-->
<!--  }-->

<!--  const editUser = (id: number) => {-->
<!--    navigateTo(`/users/${id}/edit`)-->
<!--  }-->

<!--  const confirmDelete = (user: User) => {-->
<!--    if (user.id === currentAuthUser.value?.id) {-->
<!--      showError('You cannot delete your own account')-->
<!--      return-->
<!--    }-->

<!--    userToDelete.value = user-->
<!--    showDeleteModal.value = true-->
<!--  }-->

<!--  const handleDelete = async () => {-->
<!--    if (!userToDelete.value) return-->

<!--    deleteLoading.value = true-->
<!--    try {-->
<!--      const result = await deleteUser(userToDelete.value.id)-->
<!--      if (result.success) {-->
<!--        showDeleteModal.value = false-->
<!--        await fetchUsers(filters) // Refresh the list-->
<!--        await fetchStatistics() // Update statistics-->
<!--      }-->
<!--    } finally {-->
<!--      deleteLoading.value = false-->
<!--      userToDelete.value = null-->
<!--    }-->
<!--  }-->

<!--  const toggleVerification = async (user: User) => {-->
<!--    toggleLoading.value = user.id-->
<!--    try {-->
<!--      const result = await toggleEmailVerification(user.id)-->
<!--      if (result.success) {-->
<!--        await fetchUsers(filters) // Refresh the list-->
<!--        await fetchStatistics() // Update statistics-->
<!--      }-->
<!--    } finally {-->
<!--      toggleLoading.value = null-->
<!--    }-->
<!--  }-->

<!--  const formatDate = (dateString: string) => {-->
<!--    return new Date(dateString).toLocaleDateString('en-US', {-->
<!--      year: 'numeric',-->
<!--      month: 'short',-->
<!--      day: 'numeric',-->
<!--      hour: '2-digit',-->
<!--      minute: '2-digit',-->
<!--    })-->
<!--  }-->

<!--  // Initialize data-->
<!--  onMounted(async () => {-->
<!--    await Promise.all([fetchUsers(filters), fetchStatistics()])-->
<!--  })-->

<!--  // SEO Meta-->
<!--  useSeoMeta({-->
<!--    title: 'User Management',-->
<!--    description: 'Manage users and their permissions',-->
<!--  })-->
<!--</script>-->
