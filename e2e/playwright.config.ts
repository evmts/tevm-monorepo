import { PlaywrightTestConfig, devices } from '@playwright/test'
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
	testDir: './src',
	retries: 1,
	reporter: [
		['line'],
		['junit', { outputFile: 'test-results/results.xml' }],
		['json', { outputFile: 'test-results/results.json' }],
		['html', { outputFile: 'test-results/results.html' }],
	],
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		headless: Boolean(process.env.PLAYWRIGHT_HEADLESS_MODE),
		launchOptions: {
			slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || '0'),
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
