// turn off ts for this file
// @ts-nocheck
import {
	type BrowserContext,
	chromium,
	expect,
	test as base,
} from '@playwright/test'
import metamask from '@synthetixio/synpress/commands/metamask.js'
import helpers from '@synthetixio/synpress/helpers.js'
import { Chain, mainnet } from 'viem/chains'

const { initialSetup } = metamask
const { prepareMetamask } = helpers

export const testWithSynpress = base.extend<{
	context: BrowserContext
}>({
	context: async ({ }, use) => {
		// required for synpress
		global.expect = expect
		// download metamask
		const metamaskPath = await prepareMetamask(
			process.env.PLAYWRIGHT_METAMASK_VERSION || '10.25.0',
		)
		// prepare browser args
		const browserArgs = [
			`--disable-extensions-except=${metamaskPath}`,
			`--load-extension=${metamaskPath}`,
			'--remote-debugging-port=9222',
		]
		if (process.env.CI) {
			browserArgs.push('--disable-gpu')
		}
		if (Boolean(process.env.PLAYWRIGHT_HEADLESS_MODE) && !['0', ''].includes(
			process.env.PLAYWRIGHT_HEADLESS_MODE
		)) {
			browserArgs.push('--headless=new')
		}
		// launch browser
		const context = await chromium.launchPersistentContext('', {
			headless: false,
			args: browserArgs,
		})
		// wait for metamask
		await context.pages()[0].waitForTimeout(3000)
		// setup metamask
		await initialSetup(chromium, config)
		await use(context)
	},
})
export { expect }

export const network = {
	name: 'playwright-e2e-network',
	chainId: process.env.PLAYWRIGHT_CHAIN_ID ?? mainnet.id,
	symbol: mainnet.nativeCurrency.symbol,
	rpcUrl: process.env.PLAYWRIGHT_RPC_URL ?? 'http://localhost:8546',
	rpcUrls: {
		public: { http: [process.env.PLAYWRIGHT_RPC_URL ?? 'http://localhost:8546'] },
		default: { http: [process.env.PLAYWRIGHT_RPC_URL ?? 'http://localhost:8546'] }
	}
} satisfies Chain
export const config = {
	network,
	secretWordsOrPrivateKey:
		process.env.PLAYWRIGHT_PRIVATE_KEY ?? 'test test test test test test test test test test test junk',
	password: 'Tester@1234',
	enableAdvancedSettings: true,
}
