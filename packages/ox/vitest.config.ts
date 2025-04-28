import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'json-summary'],
      include: ['src/**/*.ts', 'src/**/*.js'],
      exclude: ['node_modules/**', 'src/**/*.spec.ts', 'src/**/test/**'],
    },
  },
})