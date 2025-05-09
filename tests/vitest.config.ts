import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.ts'],
    // Speed up tests by reducing unnecessary overhead
    minThreads: 1,
    maxThreads: 4,
    // Setup benchmarking configuration
    benchmark: {
      include: ['**/*.{bench}.ts'],
      outputFile: './bench/benchmark-results.json',
      reporters: ['json', 'default'],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/bench/**'],
    },
  },
})