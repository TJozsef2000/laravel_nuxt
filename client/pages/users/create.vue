<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- Header -->
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New User</h1>
        <p class="text-gray-600 dark:text-gray-400">Add a new user to the system</p>
      </div>
    </div>

    <!-- Create User Form -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium">User Information</h3>
      </template>

      <UForm
        :schema="createUserSchema"
        :state="form"
        class="space-y-6"
        @submit="handleSubmit"
      >
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UFormField
            label="Full Name"
            name="name"
            required
          >
            <UInput
              v-model="form.name"
              placeholder="Enter full name"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField
            label="Email Address"
            name="email"
            required
          >
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter email address"
              :disabled="isLoading"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UFormField
            label="Password"
            name="password"
            required
          >
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField
            label="Confirm Password"
            name="password_confirmation"
            required
          >
            <UInput
              v-model="form.password_confirmation"
              type="password"
              placeholder="Confirm password"
              :disabled="isLoading"
            />
          </UFormField>
        </div>

        <!-- Password Requirements -->
        <UAlert
          color="info"
          variant="soft"
          title="Password Requirements"
          icon="i-heroicons-information-circle"
        >
          <template #description>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• At least 8 characters long</li>
              <li>• Contains at least one uppercase letter</li>
              <li>• Contains at least one lowercase letter</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character</li>
            </ul>
          </template>
        </UAlert>

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
            :disabled="isLoading"
            @click="navigateTo('/users')"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="primary"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Create User
          </UButton>
        </div>
      </UForm>
    </UCard>

    <!-- Additional Information -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-medium">Important Notes</h3>
      </template>

      <div class="space-y-4 text-sm">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-information-circle"
            class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Email Verification</p>
            <p class="text-gray-600 dark:text-gray-400">
              New users will be created with unverified email status. You can manually verify their
              email from the user management interface.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-shield-check"
            class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Password Security</p>
            <p class="text-gray-600 dark:text-gray-400">
              Passwords are automatically hashed and securely stored. Users can change their
              password after logging in.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-envelope"
            class="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500"
          />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">Account Access</p>
            <p class="text-gray-600 dark:text-gray-400">
              Users will be able to log in immediately after account creation using their email and
              password.
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  import type { CreateUserData } from '~/types/user'

  definePageMeta({
    middleware: 'auth',
    layout: 'default',
  })

  const { createUser, isLoading } = useUsers()
  const { createUserSchema } = useUserValidation()
  const { showSuccess, showError } = useNotifications()

  const form = reactive<CreateUserData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const error = ref<string>('')

  const handleSubmit = async (event: { data: CreateUserData }) => {
    const data = event.data as CreateUserData
    error.value = ''

    try {
      const result = await createUser(data)

      if (result.success) {
        showSuccess(`User "${data.name}" created successfully!`)
        await navigateTo('/users')
      } else {
        error.value = result.error || 'Failed to create user. Please try again.'
      }
    } catch (err) {
      error.value = 'An unexpected error occurred. Please try again.'
      showError('Failed to create user')
    }
  }

  useSeoMeta({
    title: 'Create User',
    description: 'Create a new user account',
  })
</script>
