import { transports } from '@tevm/test-utils'
import { parseGwei } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { gasPriceHandler } from './gasPriceHandler.js'

describe(gasPriceHandler.name, () => {
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
			await gasPriceHandler({
				getVm: () => ({ blockchain }) as any,
			} as any)({}),
		).toBe(parseGwei('1'))
	})

	it('should fetch from fork uri', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		expect(
			await gasPriceHandler({
				forkTransport: transports.mainnet,
				getVm: () => ({ blockchain }) as any,
			} as any)({}),
		).toBeGreaterThan(parseGwei('.1'))

		// Gas price may change between requests in real network
		const firstResult = await gasPriceHandler({
			forkTransport: transports.mainnet,
			getVm: () => ({ blockchain }) as any,
		} as any)({})

		const secondResult = await gasPriceHandler({
			forkTransport: transports.mainnet,
			getVm: () => ({ blockchain }) as any,
		} as any)({})

		// Just verify both are valid gas prices (don't check exact equality)
		expect(typeof firstResult).toBe('bigint')
		expect(typeof secondResult).toBe('bigint')
		expect(firstResult).toBeGreaterThan(0n)
		expect(secondResult).toBeGreaterThan(0n)
	})
})
