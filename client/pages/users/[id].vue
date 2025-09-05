<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          @click="navigateTo('/users')"
        >
          Back to Users
        </UButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Details</h1>
          <p class="text-gray-600 dark:text-gray-400">View and manage user information</p>
        </div>
      </div>

      <div
        v-if="currentUser"
        class="flex items-center gap-2"
      >
        <UButton
          icon="i-heroicons-pencil"
          color="warning"
          @click="navigateTo(`/users/${currentUser.id}/edit`)"
        >
          Edit User
        </UButton>

        <UButton
          :icon="
            currentUser.email_verified_at
              ? 'i-heroicons-shield-exclamation'
              : 'i-heroicons-shield-check'
          "
          :color="currentUser.email_verified_at ? 'warning' : 'success'"
          :loading="toggleLoading"
          @click="toggleVerification"
        >
          {{ currentUser.email_verified_at ? 'Mark Unverified' : 'Mark Verified' }}
        </UButton>

        <UButton
          v-if="currentUser.id !== authUser?.id"
          icon="i-heroicons-trash"
          color="error"
          @click="confirmDelete"
        >
          Delete User
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading && !currentUser"
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="h-8 w-8 animate-spin text-gray-400"
      />
    </div>

    <!-- User Information -->
    <div
      v-else-if="currentUser"
      class="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <!-- Main Information -->
      <div class="space-y-6 lg:col-span-2">
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium">Basic Information</h3>
          </template>

          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-user"
                    class="h-5 w-5 text-gray-400"
                  />
                  <span class="text-gray-900 dark:text-white">{{ currentUser.name }}</span>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-envelope"
                    class="h-5 w-5 text-gray-400"
                  />
                  <span class="text-gray-900 dark:text-white">{{ currentUser.email }}</span>
                  <UBadge
                    v-if="currentUser.email_verified_at"
                    color="success"
                    variant="soft"
                    size="sm"
                  >
                    Verified
                  </UBadge>
                  <UBadge
                    v-else
                    color="warning"
                    variant="soft"
                    size="sm"
                  >
                    Unverified
                  </UBadge>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  User ID
                </label>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-hashtag"
                    class="h-5 w-5 text-gray-400"
                  />
                  <span class="font-mono text-gray-900 dark:text-white">{{ currentUser.id }}</span>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Status
                </label>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="h-5 w-5 text-green-500"
                  />
                  <span class="font-medium text-green-600 dark:text-green-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Account Timeline -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium">Account Timeline</h3>
          </template>

          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="rounded-full bg-primary-100 p-2 dark:bg-primary-900">
                <UIcon
                  name="i-heroicons-user-plus"
                  class="h-4 w-4 text-primary-600 dark:text-primary-400"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">Account Created</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(currentUser.created_at) }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <UIcon
                  name="i-heroicons-pencil-square"
                  class="h-4 w-4 text-green-600 dark:text-green-400"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">Last Updated</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(currentUser.updated_at) }}
                </p>
              </div>
            </div>

            <div
              v-if="currentUser.email_verified_at"
              class="flex items-start gap-4"
            >
              <div class="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <UIcon
                  name="i-heroicons-shield-check"
                  class="h-4 w-4 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">Email Verified</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(currentUser.email_verified_at) }}
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Side Information -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium">Quick Actions</h3>
          </template>

          <div class="space-y-3">
            <UButton
              icon="i-heroicons-pencil"
              variant="outline"
              color="warning"
              block
              @click="navigateTo(`/users/${currentUser.id}/edit`)"
            >
              Edit Profile
            </UButton>

            <UButton
              :icon="
                currentUser.email_verified_at
                  ? 'i-heroicons-shield-exclamation'
                  : 'i-heroicons-shield-check'
              "
              variant="outline"
              :color="currentUser.email_verified_at ? 'warning' : 'success'"
              block
              :loading="toggleLoading"
              @click="toggleVerification"
            >
              {{ currentUser.email_verified_at ? 'Mark as Unverified' : 'Mark as Verified' }}
            </UButton>

            <UButton
              v-if="currentUser.id !== authUser?.id"
              icon="i-heroicons-trash"
              variant="outline"
              color="error"
              block
              @click="confirmDelete"
            >
              Delete Account
            </UButton>
          </div>
        </UCard>

        <!-- Account Statistics -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-medium">Account Info</h3>
          </template>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Member since</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatMemberSince(currentUser.created_at) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Email status</span>
              <UBadge
                :color="currentUser.email_verified_at ? 'success' : 'warning'"
                variant="soft"
                size="sm"
              >
                {{ currentUser.email_verified_at ? 'Verified' : 'Unverified' }}
              </UBadge>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Account type</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Standard</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="!isLoading"
      color="error"
      variant="soft"
      title="User Not Found"
      description="The requested user could not be found."
      icon="i-heroicons-exclamation-triangle"
    />

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Confirm Delete</h3>
        </template>

        <div class="space-y-4">
          <p>
            Are you sure you want to delete
            <strong>{{ currentUser?.name }}</strong
            >?
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            This action cannot be undone. All user data will be permanently removed.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              color="neutral"
              @click="showDeleteModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="error"
              :loading="deleteLoading"
              @click="handleDelete"
            >
              Delete User
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
    layout: 'default',
  })

  const route = useRoute()
  const { user: authUser } = useAuth()
  const { currentUser, isLoading, fetchUser, deleteUser, toggleEmailVerification } = useUsers()
  const { showSuccess, showError } = useNotifications()

  const userId = computed(() => parseInt(route.params.id as string))
  const showDeleteModal = ref(false)
  const deleteLoading = ref(false)
  const toggleLoading = ref(false)

  const toggleVerification = async () => {
    if (!currentUser.value) return

    toggleLoading.value = true
    try {
      const result = await toggleEmailVerification(currentUser.value.id)
      if (result.success) {
        // currentUser is already updated by the composable
      }
    } finally {
      toggleLoading.value = false
    }
  }

  const confirmDelete = () => {
    if (currentUser.value?.id === authUser.value?.id) {
      showError('You cannot delete your own account')
      return
    }

    showDeleteModal.value = true
  }

  const handleDelete = async () => {
    if (!currentUser.value) return

    deleteLoading.value = true
    try {
      const result = await deleteUser(currentUser.value.id)
      if (result.success) {
        showDeleteModal.value = false
        await navigateTo('/users')
      }
    } finally {
      deleteLoading.value = false
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  // Initialize data
  onMounted(async () => {
    if (userId.value) {
      await fetchUser(userId.value)
    }
  })

  // Watch for route changes
  watch(userId, async newId => {
    if (newId) {
      await fetchUser(newId)
    }
  })

  useSeoMeta({
    title: computed(() =>
      currentUser.value ? `${currentUser.value.name} - User Details` : 'User Details'
    ),
    description: 'View user details and manage account',
  })
</script>
