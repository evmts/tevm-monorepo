import { describe, expect, it } from 'bun:test'
import { parseGwei } from '@tevm/utils'
import { gasPriceHandler } from './gasPriceHandler.js'
import { transports } from '@tevm/test-utils'

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
		).toBeGreaterThan(parseGwei('1'))

		// should be able tof etch again and have it cached
		expect(
			await gasPriceHandler({
				forkTransport: transports.mainnet,
				getVm: () => ({ blockchain }) as any,
			} as any)({}),
		).toBe(
			await gasPriceHandler({
				forkTransport: transports.mainnet,
				getVm: () => ({ blockchain }) as any,
			} as any)({}),
		)
	})
})
