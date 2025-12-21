import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilMineDetailedJsonRpcProcedure } from './anvilMineDetailedProcedure.js'

describe('anvilMineDetailedJsonRpcProcedure', () => {
	it('should mine a block and return detailed results', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilMineDetailedJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_mineDetailed',
			params: ['0x1', '0x1'],
			id: 1,
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_mineDetailed')
		expect(result.id).toBe(1)
		expect(result).toHaveProperty('result')

		// @ts-ignore
		const blocks = result.result?.blocks
		expect(blocks).toBeDefined()
		expect(Array.isArray(blocks)).toBe(true)
		expect(blocks.length).toBe(1)

		const block = blocks[0]
		expect(block).toHaveProperty('number')
		expect(block).toHaveProperty('hash')
		expect(block).toHaveProperty('timestamp')
		expect(block).toHaveProperty('gasUsed')
		expect(block).toHaveProperty('gasLimit')
		expect(block).toHaveProperty('transactions')
		expect(Array.isArray(block.transactions)).toBe(true)
	})

	it('should mine multiple blocks when blockCount > 1', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilMineDetailedJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_mineDetailed',
			params: ['0x3', '0x1'], // Mine 3 blocks
			id: 2,
		})

		expect(result).toHaveProperty('result')
		// @ts-ignore
		const blocks = result.result?.blocks
		expect(blocks.length).toBe(3)

		// Verify blocks are in order
		for (let i = 1; i < blocks.length; i++) {
			const prevBlockNumber = BigInt(blocks[i - 1].number)
			const currentBlockNumber = BigInt(blocks[i].number)
			expect(currentBlockNumber).toBe(prevBlockNumber + 1n)
		}
	})

	it('should use default values when params are not provided', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilMineDetailedJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_mineDetailed',
			params: [],
			id: 3,
		})

		expect(result).toHaveProperty('result')
		// @ts-ignore
		const blocks = result.result?.blocks
		expect(blocks.length).toBe(1) // Default blockCount is 1
	})

	it('should return error when client is already mining', async () => {
		const node = createTevmNode()
		await node.ready()
		node.status = 'MINING'

		const procedure = anvilMineDetailedJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_mineDetailed',
			params: ['0x1'],
			id: 4,
		})

		expect(result).toHaveProperty('error')
		// @ts-ignore
		expect(result.error.message).toBe('Mining is already in progress')
	})

	it('should work without id in request', async () => {
		const node = createTevmNode()
		await node.ready()

		const procedure = anvilMineDetailedJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_mineDetailed',
			params: ['0x1'],
		})

		expect(result).not.toHaveProperty('id')
		expect(result).toHaveProperty('result')
	})
})
