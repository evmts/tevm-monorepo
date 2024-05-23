import { describe, expect, it, jest } from 'bun:test'
import { getAlchemyUrl } from '@tevm/test-utils'
import { parseGwei } from '@tevm/utils'
import { gasPriceHandler } from './gasPriceHandler.js'
import { http } from 'viem'

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
})
