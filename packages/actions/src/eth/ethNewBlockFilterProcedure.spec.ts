import { Block } from '@tevm/block'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { ethNewBlockFilterProcedure } from './ethNewBlockFilterProcedure.js'

describe('ethNewBlockFilterProcedure', () => {
	it('should create a new block filter and return its id', async () => {
		const client = createTevmNode()
		const newBlockFilterProcedure = ethNewBlockFilterProcedure(client)

		const request = {
			method: 'eth_newBlockFilter',
			params: [],
			jsonrpc: '2.0',
			id: 1,
		} as const

		const result = await newBlockFilterProcedure(request)

		// Check that the result contains a filter id
		expect(result).toEqual({
			id: 1,
			method: 'eth_newBlockFilter',
			jsonrpc: '2.0',
			result: expect.any(String),
		})

		const filterId = result.result as `0x${string}`

		// Verify that the filter was added to the client
		const filters = client.getFilters()
		expect(filters.has(filterId)).toBe(true)

		const filter = filters.get(filterId)
		expect(filter).toEqual({
			id: filterId,
			type: 'Block',
			created: expect.any(Number),
			logs: [],
			tx: [],
			blocks: [],
			installed: {},
			err: undefined,
			registeredListeners: expect.any(Array),
		})

		const vm = await client.getVm()

		// Test that the listener is working
		const newBlock = Block.fromBlockData({ header: { number: 1n } }, { common: vm.common })
		filter?.registeredListeners[0]?.(newBlock)

		// Verify that the block was added to the filter
		expect(filter?.blocks).toContain(newBlock)
	})
})
