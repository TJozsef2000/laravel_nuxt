import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.nuxt/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
    },
    setupFiles: ['./tests/setup.ts'],
  },
})