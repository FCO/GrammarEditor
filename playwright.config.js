import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://localhost:3002',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 5000,
  },
  webServer: {
    command: 'node e2e/mock-server.js',
    port: 3002,
    timeout: 10000,
    reuseExistingServer: !process.env.CI,
  },
});
