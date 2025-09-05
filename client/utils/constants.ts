// Application constants
export const APP_NAME = 'Laravel Nuxt Auth'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    USER: '/api/auth/user',
    PROFILE: '/api/auth/profile',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    EMAIL_VERIFICATION: '/api/auth/email/verification-notification',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  USERS: {
    INDEX: '/api/users',
    SHOW: (id: string | number) => `/api/users/${id}`,
    STORE: '/api/users',
    UPDATE: (id: string | number) => `/api/users/${id}`,
    DELETE: (id: string | number) => `/api/users/${id}`,
    TOGGLE_VERIFICATION: (id: string | number) => `/api/users/${id}/toggle-verification`,
    STATISTICS: '/api/users-statistics',
    SEARCH: '/api/users-search',
    RECENT: '/api/users-recent',
    BULK_DELETE: '/api/users/bulk-delete',
    EXPORT: '/api/users/export',
  },
} as const

// Pagination constants
export const PAGINATION = {
  DEFAULT_PER_PAGE: 15,
  MAX_PER_PAGE: 100,
  DEFAULT_PAGE: 1,
} as const

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,
} as const

// UI constants
export const UI = {
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 4000,
    WARNING: 4000,
  },
  MODAL_SIZES: {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
    '2XL': '2xl',
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
} as const

// Theme constants
export const THEME = {
  COLORS: {
    PRIMARY: 'primary',
    NEUTRAL: 'neutral',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },
} as const

// Permissions
export const PERMISSIONS = {
  USERS_VIEW: 'users_view',
  USERS_CREATE: 'users_create',
  USERS_EDIT: 'users_edit',
  USERS_DELETE: 'users_delete',
  USERS_RESTORE: 'users_restore',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'nuxt-color-mode',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  USER_PREFERENCES: 'user-preferences',
} as const

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  DATE_ONLY: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm:ss',
} as const