import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilMetadataJsonRpcProcedure } from './anvilMetadataProcedure.js'

describe('anvilMetadataJsonRpcProcedure', () => {
	it('should return metadata for a normal (non-fork) node', async () => {
		const node = createTevmNode()
		const procedure = anvilMetadataJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_metadata',
			params: [],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_metadata',
			result: {
				clientVersion: 'tevm/1.0.0',
				chainId: expect.any(Number),
				snapshots: {},
			},
			id: 1,
		})

		expect(result.result.chainId).toBeGreaterThan(0)
		expect(result.result.forked).toBeUndefined()
	})

	it.skipIf(!process.env.TEVM_RPC_URLS_OPTIMISM)('should include fork information for a forked node', async () => {
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
		const procedure = anvilMetadataJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_metadata',
			params: [],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_metadata',
			result: {
				clientVersion: 'tevm/1.0.0',
				chainId: expect.any(Number),
				forked: {
					url: forkUrl,
					blockNumber: expect.any(Number),
				},
				snapshots: {},
			},
			id: 1,
		})

		expect(result.result.forked).toBeDefined()
		expect(result.result.forked?.url).toBe(forkUrl)
		expect(result.result.forked?.blockNumber).toBeGreaterThanOrEqual(0)
	})

	it('should include snapshots when available', async () => {
		const node = createTevmNode()
		const vm = await node.getVm()
		const state = await vm.stateManager.dumpCanonicalGenesis()
		const stateRoot = vm.stateManager._baseState.getCurrentStateRoot()

		// Create a snapshot
		const snapshotId = node.addSnapshot(stateRoot, state)

		const procedure = anvilMetadataJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_metadata',
			params: [],
			id: 1,
		})

		expect(result.result.snapshots).toHaveProperty(snapshotId)
		expect(result.result.snapshots[snapshotId]).toBe(stateRoot)
	})

	it('should work without id in request', async () => {
		const node = createTevmNode()
		const procedure = anvilMetadataJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_metadata',
			params: [],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_metadata',
			result: {
				clientVersion: 'tevm/1.0.0',
				chainId: expect.any(Number),
				snapshots: {},
			},
		})
	})
})
