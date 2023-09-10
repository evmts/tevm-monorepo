import { testWithSynpress, network } from './fixtures'
// @ts-ignore
import metamask from "@synthetixio/synpress/commands/metamask.js";

testWithSynpress('should be able to read and write', async ({ page }) => {
	const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'
	console.log(`going to ${baseUrl}`)
	await page.goto(baseUrl)
	await page.getByTestId('rk-connect-button').click()
	await page.getByText('MetaMask').click()
	await metamask.acceptAccess();
	await page.getByText('reads').click()
	// assert ownerOf(1) query worked
	page.getByText('0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6')
	// assert symbol
	page.getByText('WAGMI')

	// test a write
	await page.getByText('writes').click()
	await page.getByText('Mint').click()
	await metamask.confirmTransactionAndWaitForMining()
})
