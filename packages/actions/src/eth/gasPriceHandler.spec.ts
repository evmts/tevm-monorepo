import { parseGwei } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
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
		let blockNumber = 420n
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: blockNumber,
					},
				}),
		}
		const request = vi
			.fn<(...args: any[]) => Promise<`0x${string}`>>()
			.mockResolvedValueOnce('0x2540be400')
			.mockResolvedValueOnce('0x3b9aca00')

		const handler = gasPriceHandler({
			forkTransport: {
				request,
			},
			getVm: () => ({ blockchain }) as any,
		} as any)

		const firstResult = await handler({})
		const secondResult = await handler({})

		expect(firstResult).toBe(parseGwei('10'))
		expect(secondResult).toBe(parseGwei('10'))
		expect(request).toHaveBeenCalledTimes(1)

		blockNumber = 421n
		const thirdResult = await handler({})
		expect(thirdResult).toBe(parseGwei('1'))
		expect(request).toHaveBeenCalledTimes(2)
	})
})
