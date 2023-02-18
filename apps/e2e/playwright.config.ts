import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "src",
	workers: 5,
	retries: 1,
	webServer: {
		command: "pnpm nx serve @evmts/playground",
		port: 5173,
		reuseExistingServer: true,
		timeout: 60000,
	},
	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
		},
		{
			name: "firefox",
			use: { browserName: "firefox" },
		},
		{
			name: "mobile-chromium",
			use: devices["Pixel 5"],
		},
	],
};

export default config;
