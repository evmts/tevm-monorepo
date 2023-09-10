import { PlaywrightTestConfig, devices } from '@playwright/test'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config: PlaywrightTestConfig = {
	testDir: './src',
	retries: 1,
	reporter: [
		['line'],
		['junit', { outputFile: 'test-results/results.xml' }],
		['json', { outputFile: 'test-results/results.json' }],
		['html'],
	],
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
    video: 'retain-on-failure',
		headless: false,
		launchOptions: {
			slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || '0'),
		}
	},
	webServer: {
		command: `pnpm nx test-server ${process.env.EXAMPLE_PROJECT ?? "@evmts/example-vite"}`,
		url: `http://localhost:${process.env.SERVER_PORT ?? '5173'}`,
		reuseExistingServer: false,
		env: {
			VITE_RPC_URL_1: 'http://localhost:8546',
			VITE_RPC_URL_10: 'http://localhost:9545',
			VITE_RPC_URL_420: 'http://localhost:9546',
			PRIVATE_KEY: 'test test test test test test test test test test test junk',
			SERVER_PORT: process.env.SERVER_PORT ?? '5173',
		}
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
}

export default config
