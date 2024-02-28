import { createL1Client } from '../index.js'
import { describe, expect, it } from 'bun:test'

describe('createL1Client', () => {
	it('Should initialize a memory client syncronously with a ready function to see when client is ready', async () => {
		const client = createL1Client()
		expect(client.mode).toBe('normal')
		expect(await client.ready()).toBeTruthy()
	})

	it('should deploy a lot of contracts', async () => {
		const client = createL1Client()

		expect(await client.ready()).toBeTruthy()

		const accounts = await Promise.all([
			client.getAccount(client.op.L1Erc721Bridge),
			client.getAccount(client.op.SuperchainConfig),
			client.getAccount(client.op.L1CrossDomainMessenger),
			client.getAccount(client.op.L1StandardBridge),
			client.getAccount(client.op.L2OutputOracle),
			client.getAccount(client.op.OptimismPortal2),
			client.getAccount(client.op.DisputeGameFactory),
			client.getAccount(client.op.SystemConfig),
			client.getAccount(client.op.OptimismMintableERC20Factory),
		])

		// every account should have a contract
		expect(
			accounts.map((account) => account.isContract).every(Boolean),
		).toBeTruthy()
	})
})
