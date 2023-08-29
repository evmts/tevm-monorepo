import { testWithSynpress } from '../fixtures'
// @ts-ignore
import metamask from "@synthetixio/synpress/commands/metamask.js";

testWithSynpress('should be able to read and write', async ({ page }) => {
	await page.goto('http://localhost:5173')
	page.getByTestId('rk-connect-button').click()
	page.getByText('MetaMask').click()
	await metamask.acceptAccess();
	page.getByText('reads').click()
	// assert ownerOf(1) query worked
	page.getByText('0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6')
	// assert symbol
	page.getByText('WAGMI')

	// test a write
	page.getByText('writes').click()
	page.getByText('Mint').click()
	// const txData = await metamask.confirmMetamaskTransaction()
	// TODO check for events
})
