import { PlaywrightTestConfig, devices } from '@playwright/test'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config: PlaywrightTestConfig = {
	testDir: 'src',
	retries: 3,
	use: {
		headless: false,
	  launchOptions: {
	  	slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || '0'),
		}
	},
	webServer: {
		command: 'pnpm nx dev @evmts/example-vite',
		port: 5173,
		reuseExistingServer: true,
		timeout: 180000,
		env: {
			VITE_RPC_URL_1: process.env.VITE_RPC_URL_1 ?? 'http://localhost:8545',
			VITE_RPC_URL_420: process.env.VITE_RPC_URL_420 ?? 'http://localhost:9545',
			PRIVATE_KEY: process.env.PRIVATE_KEY ?? '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
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
