<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        @click="navigateTo(`/users/${userId}`)"
      >
        Back to User
      </UButton>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit User</h1>
        <p class="text-gray-600 dark:text-gray-400">Update user information and settings</p>
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

    <!-- Edit User Form -->
    <div v-else-if="currentUser">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">User Information</h3>
            <UBadge
              :color="currentUser.email_verified_at ? 'success' : 'warning'"
              variant="soft"
            >
              {{ currentUser.email_verified_at ? 'Verified' : 'Unverified' }}
            </UBadge>
          </div>
        </template>

        <UForm
          :schema="updateUserSchema"
          :state="form"
          class="space-y-6"
          @submit="handleSubmit"
        >
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <UFormField
              label="Full Name"
              name="name"
            >
              <UInput
                v-model="form.name"
                placeholder="Enter full name"
                :disabled="formLoading"
              />
            </UFormField>

            <UFormField
              label="Email Address"
              name="email"
            >
              <UInput
                v-model="form.email"
                type="email"
                placeholder="Enter email address"
                :disabled="formLoading"
              />
            </UFormField>
          </div>

          <!-- Password Section -->
          <div class="border-t border-gray-200 pt-6 dark:border-gray-700">
            <div class="mb-4 flex items-center justify-between">
              <h4 class="text-md font-medium text-gray-900 dark:text-white">Password Settings</h4>
              <UButton
                v-if="!showPasswordFields"
                variant="ghost"
                color="info"
                size="sm"
                @click="showPasswordFields = true"
              >
                Change Password
              </UButton>
            </div>

            <div
              v-if="showPasswordFields"
              class="space-y-4"
            >
              <UAlert
                color="info"
                variant="soft"
                title="Password Change"
                icon="i-heroicons-information-circle"
              >
                <template #description>
                  Leave password fields empty to keep the current password unchanged.
                </template>
              </UAlert>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <UFormField
                  label="New Password"
                  name="password"
                >
                  <UInput
                    v-model="form.password"
                    type="password"
                    placeholder="Enter new password"
                    :disabled="formLoading"
                  />
                </UFormField>

                <UFormField
                  label="Confirm New Password"
                  name="password_confirmation"
                >
                  <UInput
                    v-model="form.password_confirmation"
                    type="password"
                    placeholder="Confirm new password"
                    :disabled="formLoading"
                  />
                </UFormField>
              </div>

              <div class="flex justify-end">
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  @click="clearPasswordFields"
                >
                  Cancel Password Change
                </UButton>
              </div>
            </div>
          </div>

          <!-- Email Verification Section -->
          <div class="border-t border-gray-200 pt-6 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-md font-medium text-gray-900 dark:text-white">
                  Email Verification
                </h4>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Current status:
                  <span
                    :class="
                      currentUser.email_verified_at
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400'
                    "
                  >
                    {{ currentUser.email_verified_at ? 'Verified' : 'Unverified' }}
                  </span>
                </p>
              </div>
              <UButton
                :icon="
                  currentUser.email_verified_at
                    ? 'i-heroicons-shield-exclamation'
                    : 'i-heroicons-shield-check'
                "
                :color="currentUser.email_verified_at ? 'warning' : 'success'"
                variant="outline"
                :loading="toggleLoading"
                @click="toggleVerification"
              >
                {{ currentUser.email_verified_at ? 'Mark Unverified' : 'Mark Verified' }}
              </UButton>
            </div>
          </div>

          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :title="error"
            icon="i-heroicons-exclamation-triangle"
          />

          <div class="mt-6 flex justify-end gap-3">
            <UButton
              variant="ghost"
              color="neutral"
              :disabled="formLoading"
              @click="navigateTo(`/users/${userId}`)"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="formLoading"
              :disabled="formLoading"
            >
              Update User
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Additional Information -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Account Information</h3>
        </template>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              User ID
            </label>
            <div class="flex items-center gap-2">
              <code class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                {{ currentUser.id }}
              </code>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Created
            </label>
            <p class="text-sm text-gray-900 dark:text-white">
              {{ formatDateTime(currentUser.created_at) }}
            </p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Updated
            </label>
            <p class="text-sm text-gray-900 dark:text-white">
              {{ formatDateTime(currentUser.updated_at) }}
            </p>
          </div>

          <div v-if="currentUser.email_verified_at">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Verified
            </label>
            <p class="text-sm text-gray-900 dark:text-white">
              {{ formatDateTime(currentUser.email_verified_at) }}
            </p>
          </div>
        </div>
      </UCard>
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
  </div>
</template>

<script setup lang="ts">
  import type { UpdateUserData } from '~/types/user'

  definePageMeta({
    middleware: 'auth',
    layout: 'default',
  })

  const route = useRoute()
  const { currentUser, isLoading, fetchUser, updateUser, toggleEmailVerification } = useUsers()
  const { updateUserSchema } = useUserValidation()
  const { showSuccess, showError } = useNotifications()

  const userId = computed(() => parseInt(route.params.id as string))
  const formLoading = ref(false)
  const toggleLoading = ref(false)
  const showPasswordFields = ref(false)

  const form = reactive<UpdateUserData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const error = ref<string>('')

  // Initialize form with current user data
  const initializeForm = () => {
    if (currentUser.value) {
      form.name = currentUser.value.name
      form.email = currentUser.value.email
      form.password = ''
      form.password_confirmation = ''
    }
  }

  const clearPasswordFields = () => {
    form.password = ''
    form.password_confirmation = ''
    showPasswordFields.value = false
  }

  const handleSubmit = async (event: { data: UpdateUserData }) => {
    const data = event.data as UpdateUserData
    error.value = ''
    formLoading.value = true

    try {
      // Remove empty password fields to avoid updating password
      const updateData = { ...data }
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password
        delete updateData.password_confirmation
      }

      const result = await updateUser(userId.value, updateData)

      if (result.success) {
        showSuccess('User updated successfully!')
        // Update form with new data
        initializeForm()
        clearPasswordFields()
      } else {
        error.value = result.error || 'Failed to update user. Please try again.'
      }
    } catch (err) {
      error.value = 'An unexpected error occurred. Please try again.'
      showError('Failed to update user')
    } finally {
      formLoading.value = false
    }
  }

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Initialize data
  onMounted(async () => {
    if (userId.value) {
      await fetchUser(userId.value)
      initializeForm()
    }
  })

  // Watch for currentUser changes to update form
  watch(currentUser, () => {
    if (currentUser.value) {
      initializeForm()
    }
  })

  // Watch for route changes
  watch(userId, async newId => {
    if (newId) {
      await fetchUser(newId)
      initializeForm()
    }
  })

  useSeoMeta({
    title: computed(() => (currentUser.value ? `Edit ${currentUser.value.name}` : 'Edit User')),
    description: 'Edit user information and settings',
  })
</script>
