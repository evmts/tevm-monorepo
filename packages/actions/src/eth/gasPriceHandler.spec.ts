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

		// should be able to fetch again and have it cached
		const firstResult = await gasPriceHandler({
			forkTransport: transports.mainnet,
			getVm: () => ({ blockchain }) as any,
		} as any)({})

		const secondResult = await gasPriceHandler({
			forkTransport: transports.mainnet,
			getVm: () => ({ blockchain }) as any,
		} as any)({})

		expect(firstResult).toBe(secondResult)
	})
})
