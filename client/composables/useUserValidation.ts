import { z } from 'zod'

export const useUserValidation = () => {
  const createUserSchema = z
    .object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(255, 'Name cannot exceed 255 characters'),

      email: z
        .string()
        .email('Please enter a valid email address')
        .max(255, 'Email cannot exceed 255 characters'),

      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

      password_confirmation: z.string(),
    })
    .refine(data => data.password === data.password_confirmation, {
      message: 'Passwords do not match',
      path: ['password_confirmation'],
    })

  const updateUserSchema = z
    .object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(255, 'Name cannot exceed 255 characters')
        .optional(),

      email: z
        .string()
        .email('Please enter a valid email address')
        .max(255, 'Email cannot exceed 255 characters')
        .optional(),

      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
        .optional(),

      password_confirmation: z.string().optional(),
    })
    .refine(
      data => {
        if (data.password && !data.password_confirmation) {
          return false
        }
        if (data.password && data.password_confirmation) {
          return data.password === data.password_confirmation
        }
        return true
      },
      {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      }
    )

  const searchSchema = z.object({
    q: z
      .string()
      .min(2, 'Search query must be at least 2 characters')
      .max(255, 'Search query cannot exceed 255 characters'),
  })

  const filterSchema = z.object({
    search: z.string().optional(),
    filter_verified: z.boolean().optional(),
    created_from: z.string().optional(),
    created_to: z.string().optional(),
    sort_by: z.enum(['name', 'email', 'created_at', 'updated_at']).optional(),
    sort_order: z.enum(['asc', 'desc']).optional(),
    per_page: z.number().min(1).max(100).optional(),
    page: z.number().min(1).optional(),
  })

  return {
    createUserSchema,
    updateUserSchema,
    searchSchema,
    filterSchema,
  }
}
