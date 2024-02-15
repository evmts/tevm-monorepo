import { blockNumberHandler } from '../index.js'
import { describe, expect, it } from 'bun:test'

describe(blockNumberHandler.name, () => {
	it('should return the block number', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		expect(await blockNumberHandler({ vm: { blockchain } } as any)()).toBe(420n)
	})
})
