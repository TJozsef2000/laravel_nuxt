// Vitest setup file
import { vi } from 'vitest'

// Mock Nuxt composables
global.navigateTo = vi.fn()
global.useSanctumClient = vi.fn(() => vi.fn())
global.useSanctumUser = vi.fn(() => ({ value: null }))
global.useSanctumAuth = vi.fn(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  refreshIdentity: vi.fn(),
}))

// Mock Vue composables
global.ref = (value: any) => ({ value })
global.reactive = (value: any) => value
global.computed = (fn: () => any) => ({ value: fn() })
global.watch = vi.fn()
global.readonly = (value: any) => value
global.unref = (value: any) => value?.value ?? value

// Mock import.meta
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      client: true,
      server: false,
      env: {
        NODE_ENV: 'test',
      },
    },
  },
})

// Mock document and window for client-side code
Object.defineProperty(global, 'document', {
  value: {
    createElement: vi.fn(() => ({
      href: '',
      download: '',
      click: vi.fn(),
    })),
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    },
    cookie: '',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
})

Object.defineProperty(global, 'window', {
  value: {
    URL: {
      createObjectURL: vi.fn(() => 'mock-url'),
      revokeObjectURL: vi.fn(),
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    history: {
      length: 1,
      back: vi.fn(),
    },
    location: {
      search: '',
    },
  },
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })