// User management service
import type {
  CreateUserData,
  UpdateUserData,
  UserFilters,
  UserListResponse,
  UserStatistics
} from '~/types/api/users'
import type { User } from '~/types/api/auth'
import type { BaseApiResponse } from '~/types/api/base'
import { BaseApiService } from './api'

export class UsersService extends BaseApiService {
  /**
   * Get paginated list of users with filters
   */
  async getUsers(filters?: UserFilters): Promise<UserListResponse> {
    return this.get<UserListResponse>('/api/users', filters)
  }

  /**
   * Get a specific user by ID
   */
  async getUser(id: number | string): Promise<User> {
    return this.get<User>(`/api/users/${id}`)
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>('/api/users', data)
  }

  /**
   * Update an existing user
   */
  async updateUser(id: number | string, data: UpdateUserData): Promise<BaseApiResponse> {
    return this.put<BaseApiResponse>(`/api/users/${id}`, data)
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number | string): Promise<BaseApiResponse> {
    return this.delete<BaseApiResponse>(`/api/users/${id}`)
  }

  /**
   * Toggle user email verification status
   */
  async toggleUserVerification(id: number | string): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>(`/api/users/${id}/toggle-verification`)
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<UserStatistics> {
    return this.get<UserStatistics>('/api/users-statistics')
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<User[]> {
    return this.get<User[]>('/api/users-search', { q: query })
  }

  /**
   * Get recently registered users
   */
  async getRecentUsers(days: number = 7): Promise<User[]> {
    return this.get<User[]>('/api/users-recent', { days })
  }

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(userIds: number[]): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>('/api/users/bulk-delete', { user_ids: userIds })
  }

  /**
   * Export users data
   */
  async exportUsers(format: 'csv' | 'xlsx' = 'csv', filters?: UserFilters): Promise<Blob> {
    const params = { ...filters, format }
    
    // For file downloads, we need to handle the response differently
    const response = await this.client('/api/users/export', {
      method: 'GET',
      params,
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
    
    return response as Blob
  }
}

// Export singleton instance
export const usersService = new UsersService()