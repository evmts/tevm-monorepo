import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    includeSource: ['src/js/**/*.{js,ts}'],
    coverage: {
      reporter: ['text', 'json', 'json-summary'],
    },
  },
});