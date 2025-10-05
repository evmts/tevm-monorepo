import { createTevmNode } from '@tevm/node'
import { parseGwei } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ethMaxPriorityFeePerGasHandler } from './ethMaxPriorityFeePerGasHandler.js'

describe('ethMaxPriorityFeePerGasHandler', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(() => {
		client = createTevmNode()
	})

	it('should return default 1 gwei when not forked', async () => {
		const nonForkedClient = createTevmNode({
			fork: undefined,
		})

		const handler = ethMaxPriorityFeePerGasHandler(nonForkedClient)
		const result = await handler({})

		expect(result).toBe(parseGwei('1'))
	})

	it('should cache result for the same block', async () => {
		const handler = ethMaxPriorityFeePerGasHandler(client)
		
		// Call twice to ensure caching works
		const result1 = await handler({})
		const result2 = await handler({})

		expect(result1).toBe(result2)
		expect(typeof result1).toBe('bigint')
		expect(result1 > 0n).toBe(true)
	})
})