import type { User } from '~/types/api/auth'
import type {
  UserFilters,
  UserListResponse,
  CreateUserData,
  UpdateUserData,
  UserStatistics,
} from '~/types/api/users'
import { usersService } from '~/services'

export const useUsers = () => {
  const { showSuccess, showError } = useNotifications()

  const isLoading = ref(false)
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const pagination = ref<UserListResponse['data']['pagination'] | null>(null)
  const statistics = ref<UserStatistics | null>(null)

  // Fetch users with filters and pagination
  const fetchUsers = async (filters: UserFilters = {}) => {
    isLoading.value = true
    try {
      const response = await usersService.getUsers(filters)

      if (response.success) {
        users.value = response.data.items
        pagination.value = response.data.pagination || null
        return { success: true, data: response.data }
      }

      throw new Error(response.message || 'Failed to fetch users')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch a single user by ID
  const fetchUser = async (id: number | string) => {
    isLoading.value = true
    try {
      const user = await usersService.getUser(id)
      currentUser.value = user
      return { success: true, data: user }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Create a new user
  const createUser = async (userData: CreateUserData) => {
    isLoading.value = true
    try {
      const response = await usersService.createUser(userData)

      if (response.success) {
        showSuccess(response.message || 'User created successfully')
        // Refresh the users list
        await fetchUsers()
        return { success: true, data: response }
      }

      throw new Error(response.message || 'Failed to create user')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create user'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing user
  const updateUser = async (id: number | string, userData: UpdateUserData) => {
    isLoading.value = true
    try {
      const response = await usersService.updateUser(id, userData)

      if (response.success) {
        showSuccess(response.message || 'User updated successfully')
        
        // Update the user in the local array if it exists
        const userIndex = users.value.findIndex(u => u.id === Number(id))
        if (userIndex !== -1) {
          // Refetch the updated user to get complete data
          const updatedUser = await usersService.getUser(id)
          users.value[userIndex] = updatedUser
        }
        
        // Update current user if it's the same
        if (currentUser.value?.id === Number(id)) {
          currentUser.value = await usersService.getUser(id)
        }

        return { success: true, data: response }
      }

      throw new Error(response.message || 'Failed to update user')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update user'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Delete a user
  const deleteUser = async (id: number | string) => {
    isLoading.value = true
    try {
      const response = await usersService.deleteUser(id)

      if (response.success) {
        showSuccess(response.message || 'User deleted successfully')
        
        // Remove the user from the local array
        users.value = users.value.filter(u => u.id !== Number(id))
        
        // Clear current user if it's the deleted one
        if (currentUser.value?.id === Number(id)) {
          currentUser.value = null
        }

        return { success: true, data: response }
      }

      throw new Error(response.message || 'Failed to delete user')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete user'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Toggle user email verification
  const toggleUserVerification = async (id: number | string) => {
    isLoading.value = true
    try {
      const response = await usersService.toggleUserVerification(id)

      if (response.success) {
        showSuccess(response.message || 'User verification status updated')
        
        // Update the user in the local array
        const userIndex = users.value.findIndex(u => u.id === Number(id))
        if (userIndex !== -1) {
          const updatedUser = await usersService.getUser(id)
          users.value[userIndex] = updatedUser
        }

        return { success: true, data: response }
      }

      throw new Error(response.message || 'Failed to toggle user verification')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to toggle user verification'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch user statistics
  const fetchUserStatistics = async () => {
    isLoading.value = true
    try {
      const data = await usersService.getUserStatistics()
      statistics.value = data
      return { success: true, data }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user statistics'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Search users
  const searchUsers = async (query: string) => {
    isLoading.value = true
    try {
      const results = await usersService.searchUsers(query)
      return { success: true, data: results }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to search users'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Get recent users
  const fetchRecentUsers = async (days: number = 7) => {
    isLoading.value = true
    try {
      const results = await usersService.getRecentUsers(days)
      return { success: true, data: results }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch recent users'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Bulk delete users
  const bulkDeleteUsers = async (userIds: number[]) => {
    isLoading.value = true
    try {
      const response = await usersService.bulkDeleteUsers(userIds)

      if (response.success) {
        showSuccess(response.message || 'Users deleted successfully')
        
        // Remove deleted users from the local array
        users.value = users.value.filter(u => !userIds.includes(u.id))

        return { success: true, data: response }
      }

      throw new Error(response.message || 'Failed to delete users')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete users'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Export users
  const exportUsers = async (format: 'csv' | 'xlsx' = 'csv', filters?: UserFilters) => {
    isLoading.value = true
    try {
      const blob = await usersService.exportUsers(format, filters)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      showSuccess('Users exported successfully')
      return { success: true }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to export users'
      showError(message)
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    isLoading: readonly(isLoading),
    users: readonly(users),
    currentUser: readonly(currentUser),
    pagination: readonly(pagination),
    statistics: readonly(statistics),

    // Methods
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserVerification,
    toggleEmailVerification: toggleUserVerification,
    fetchUserStatistics,
    searchUsers,
    fetchRecentUsers,
    bulkDeleteUsers,
    exportUsers,
  }
}