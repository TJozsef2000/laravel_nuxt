import { z } from 'zod'

export const useAuthValidation = () => {
  const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    remember: z.boolean().optional().default(false),
  })

  const registerSchema = z
    .object({
      terms: z.boolean().refine(val => val, {
        message: 'You must accept the terms and conditions',
      }),
      name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters'),
      email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
      password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
      password_confirmation: z.string().min(1, 'Password confirmation is required'),
    })
    .refine(data => data.password === data.password_confirmation, {
      message: "Passwords don't match",
      path: ['password_confirmation'],
    })

  const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  })

  const resetPasswordSchema = z
    .object({
      token: z.string().min(1, 'Token is required'),
      email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
      password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
      password_confirmation: z.string().min(1, 'Password confirmation is required'),
    })
    .refine(data => data.password === data.password_confirmation, {
      message: "Passwords don't match",
      path: ['password_confirmation'],
    })

  return {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
  }
}
