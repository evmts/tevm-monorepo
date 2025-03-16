import { describe, expect, it } from 'vitest'
import { blockNumberHandler } from './blockNumberHandler.js'

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
		expect(await blockNumberHandler({ getVm: () => ({ blockchain }) } as any)()).toBe(420n)
	})

	it('should handle zero block number', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 0n,
					},
				}),
		}
		expect(await blockNumberHandler({ getVm: () => ({ blockchain }) } as any)()).toBe(0n)
	})

	it('should handle large block numbers', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 9999999999n,
					},
				}),
		}
		expect(await blockNumberHandler({ getVm: () => ({ blockchain }) } as any)()).toBe(9999999999n)
	})
})
