import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: 'src',
	retries: 3,
	use: {
		headless: false,
	},
	webServer: {
		command: 'pnpm nx serve:test example-vite',
		port: 5173,
		reuseExistingServer: true,
		timeout: 180000,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
}

export default config
