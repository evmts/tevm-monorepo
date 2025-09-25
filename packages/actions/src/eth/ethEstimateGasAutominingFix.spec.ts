import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethEstimateGasJsonRpcProcedure } from './ethEstimateGasProcedure.js'

// Mock mineHandler to track if mining is called during gas estimation
vi.mock('../Mine/mineHandler.js', () => ({
	mineHandler: vi.fn(),
}))

describe('ethEstimateGas - automining fix', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(() => {
		vi.resetAllMocks()

		// Create client with auto mining enabled
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'auto' }, // This should NOT cause eth_estimateGas to mine
		})

		// Mock mineHandler to track calls
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => () =>
				Promise.resolve({
					blockHashes: ['0x123'],
				}),
		)
	})

	it('should NOT trigger automining during eth_estimateGas with auto mining enabled', async () => {
		const estimateGasHandler = ethEstimateGasJsonRpcProcedure(client)

		// Make an eth_estimateGas request
		const request = {
			method: 'eth_estimateGas' as const,
			params: [
				{
					to: `0x${'69'.repeat(20)}`,
					value: '0x1A4', // 420 in hex
					data: '0x',
				},
				'latest',
			],
			jsonrpc: '2.0' as const,
			id: 1,
		}

		// This call should work and return gas estimate
		const result = await estimateGasHandler(request)

		// Should return successful gas estimate
		expect(result.error).toBeUndefined()
		expect(result.result).toBeDefined()
		expect(typeof result.result).toBe('string')

		// CRITICAL: Should NOT have triggered mining
		// This test will fail initially because current implementation mines during gas estimation
		expect(mineHandler).not.toHaveBeenCalled()
	})

	it('should NOT create transaction during eth_estimateGas', async () => {
		const estimateGasHandler = ethEstimateGasJsonRpcProcedure(client)

		// Get initial txPool state
		const txPoolBefore = await client.getTxPool()
		const txCountBefore = (await txPoolBefore.getBySenderAddress([])).length

		const request = {
			method: 'eth_estimateGas' as const,
			params: [
				{
					from: `0x${'42'.repeat(20)}`,
					to: `0x${'69'.repeat(20)}`,
					value: '0x1A4',
				},
			],
			jsonrpc: '2.0' as const,
			id: 1,
		}

		await estimateGasHandler(request)

		// Get txPool state after estimation
		const txPoolAfter = await client.getTxPool()
		const txCountAfter = (await txPoolAfter.getBySenderAddress([])).length

		// Should NOT have added any transactions to mempool
		// This test will fail initially because current implementation creates transactions during gas estimation
		expect(txCountAfter).toBe(txCountBefore)
	})

	it('should NOT affect blockchain state during eth_estimateGas', async () => {
		const estimateGasHandler = ethEstimateGasJsonRpcProcedure(client)

		// Get initial block number
		const vm = await client.getVm()
		const initialBlockNumber = vm.blockchain.blockNumber

		const request = {
			method: 'eth_estimateGas' as const,
			params: [
				{
					to: `0x${'69'.repeat(20)}`,
					value: '0x1A4',
				},
			],
			jsonrpc: '2.0' as const,
			id: 1,
		}

		await estimateGasHandler(request)

		// Block number should remain unchanged
		const finalBlockNumber = vm.blockchain.blockNumber
		expect(finalBlockNumber).toBe(initialBlockNumber)
	})
})