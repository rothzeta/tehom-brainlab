// Pattern copied from poc-001-linked-formation/vitest.config.ts at c82ec3c
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
