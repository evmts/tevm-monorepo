import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: 'src',
  retries: 3,
  webServer: {
    command: 'pnpm nx serve prototype',
    port: 5173,
    reuseExistingServer: true,
    timeout: 180000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'mobile-chromium',
      use: devices['Pixel 5'],
    },
  ],
}

export default config
