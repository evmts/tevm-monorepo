import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetBlockGasLimitJsonRpcProcedure } from './anvilSetBlockGasLimitProcedure.js'

describe('anvilSetBlockGasLimitJsonRpcProcedure', () => {
	it('should set block gas limit for subsequent blocks', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBlockGasLimitJsonRpcProcedure(client)

		// Set a custom gas limit
		const newGasLimit = 15000000n
		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBlockGasLimit',
			params: [`0x${newGasLimit.toString(16)}`],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setBlockGasLimit',
			result: null,
			id: 1,
		})

		// Verify the gas limit is set
		expect(client.getNextBlockGasLimit()).toBe(newGasLimit)

		// Mine a block and check the gas limit
		const vm = await client.getVm()
		const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
		const builder = await vm.buildBlock({
			parentBlock,
			headerData: {
				gasLimit: client.getNextBlockGasLimit() ?? parentBlock.header.gasLimit,
			},
		})
		const block = await builder.build()

		expect(block.header.gasLimit).toBe(newGasLimit)
	})

	it('should persist across multiple blocks', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBlockGasLimitJsonRpcProcedure(client)

		const newGasLimit = 10000000n
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBlockGasLimit',
			params: [`0x${newGasLimit.toString(16)}`],
			id: 1,
		})

		// The gas limit should persist for all subsequent blocks
		expect(client.getNextBlockGasLimit()).toBe(newGasLimit)

		// Even after "mining" conceptually, the override persists
		const vm = await client.getVm()
		const parentBlock1 = await vm.blockchain.getCanonicalHeadBlock()
		const builder1 = await vm.buildBlock({
			parentBlock: parentBlock1,
			headerData: {
				gasLimit: client.getNextBlockGasLimit() ?? parentBlock1.header.gasLimit,
			},
		})
		await builder1.build()

		// Should still be set
		expect(client.getNextBlockGasLimit()).toBe(newGasLimit)
	})

	it('should handle request without id', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBlockGasLimitJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBlockGasLimit',
			params: ['0xE4E1C0'], // 15,000,000 in hex
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setBlockGasLimit',
			result: null,
		})
		expect(result).not.toHaveProperty('id')
	})

	it('should handle large gas limits', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBlockGasLimitJsonRpcProcedure(client)

		const largeGasLimit = 30000000n
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBlockGasLimit',
			params: [`0x${largeGasLimit.toString(16)}`],
			id: 1,
		})

		expect(client.getNextBlockGasLimit()).toBe(largeGasLimit)
	})

	it('should handle small gas limits', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBlockGasLimitJsonRpcProcedure(client)

		const smallGasLimit = 100000n
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBlockGasLimit',
			params: [`0x${smallGasLimit.toString(16)}`],
			id: 1,
		})

		expect(client.getNextBlockGasLimit()).toBe(smallGasLimit)
	})
})
