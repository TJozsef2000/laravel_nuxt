import type { User } from '~/types/auth'
import type { AuthSuccessResponse } from '~/types/api'

export interface RegisterResponse extends AuthSuccessResponse<User> {
  user: User
}
