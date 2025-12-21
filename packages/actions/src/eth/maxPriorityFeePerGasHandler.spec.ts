import { parseGwei } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { maxPriorityFeePerGasHandler } from './maxPriorityFeePerGasHandler.js'

describe(maxPriorityFeePerGasHandler.name, () => {
	it('should default to 1 gwei if no forkUrl', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		expect(
			await maxPriorityFeePerGasHandler({
				getVm: () => ({ blockchain }) as any,
			} as any)({}),
		).toBe(parseGwei('1'))
	})
})
