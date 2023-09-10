import { testWithSynpress, network } from './fixtures'
// @ts-ignore
import metamask from "@synthetixio/synpress/commands/metamask.js";

testWithSynpress('should be able to read and write', async ({ page }) => {
	const pageUrl =`http://localhost:${process.env.SERVER_PORT ?? '5173'}`
	console.log(`going to ${pageUrl}`)
	await page.goto(pageUrl)
	await page.getByTestId('rk-connect-button').click()
	await page.getByText('MetaMask').click()
	await metamask.acceptAccess();
	await page.getByText('reads').click()
	// assert ownerOf(1) query worked
	await page.getByText('0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6')
	// assert symbol
	await page.getByText('WAGMI')

	// test a write
	await page.getByText('writes').click()
	await page.getByText('Mint').click()
	const txData = await metamask.confirmTransactionAndWaitForMining()
})
