import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilNodeInfoJsonRpcProcedure } from './anvilNodeInfoProcedure.js'

describe('anvilNodeInfoJsonRpcProcedure', () => {
	it('should return node information for a normal (non-fork) node', async () => {
		const node = createTevmNode()
		const procedure = anvilNodeInfoJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_nodeInfo',
			params: [],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_nodeInfo',
			result: {
				currentBlockNumber: expect.any(Number),
				currentBlockTimestamp: expect.any(Number),
				chainId: expect.any(Number),
				hardfork: expect.any(String),
				miningMode: 'auto',
			},
			id: 1,
		})

		expect(result.result.currentBlockNumber).toBeGreaterThanOrEqual(0)
		expect(result.result.currentBlockTimestamp).toBeGreaterThanOrEqual(0)
		expect(result.result.chainId).toBeGreaterThan(0)
	})

	it.skipIf(!process.env.TEVM_RPC_URLS_OPTIMISM)('should include forkUrl for a forked node', async () => {
		const forkUrl = process.env.TEVM_RPC_URLS_OPTIMISM ?? 'https://mainnet.optimism.io'
		const node = createTevmNode({
			fork: {
				transport: {
					request: async () => {
						throw new Error('Mock transport should not be called in this test')
					},
					url: forkUrl,
				},
			},
		})
		const procedure = anvilNodeInfoJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_nodeInfo',
			params: [],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_nodeInfo',
			result: {
				currentBlockNumber: expect.any(Number),
				currentBlockTimestamp: expect.any(Number),
				forkUrl,
				chainId: expect.any(Number),
				hardfork: expect.any(String),
				miningMode: 'auto',
			},
			id: 1,
		})

		expect(result.result.forkUrl).toBe(forkUrl)
	})

	it('should return manual mining mode when configured', async () => {
		const node = createTevmNode({ miningConfig: { type: 'manual' } })
		const procedure = anvilNodeInfoJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_nodeInfo',
			params: [],
			id: 1,
		})

		expect(result.result.miningMode).toBe('manual')
	})

	it('should work without id in request', async () => {
		const node = createTevmNode()
		const procedure = anvilNodeInfoJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_nodeInfo',
			params: [],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_nodeInfo',
			result: {
				currentBlockNumber: expect.any(Number),
				currentBlockTimestamp: expect.any(Number),
				chainId: expect.any(Number),
				hardfork: expect.any(String),
				miningMode: 'auto',
			},
		})
	})
})
