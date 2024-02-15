import { gasPriceHandler } from './gasPriceHandler.js'
import { parseGwei } from '@tevm/utils'
import { describe, expect, it, jest } from 'bun:test'

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
				vm: { blockchain } as any,
			})({}),
		).toBe(parseGwei('1'))
	})

	it('should fetch gas price from forkUrl and cache it', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () =>
					Promise.resolve({
						method: 'eth_gasPrice',
						result: '0x6',
						jsonrpc: '2.0',
					}),
			}),
		) as any
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		const handler = gasPriceHandler({
			vm: { blockchain } as any,
			forkUrl: 'https://mainnet.optimism.io',
		})
		expect(await handler({})).toBe(6n)
		expect(await handler({})).toBe(6n)
		expect(global.fetch).toHaveBeenCalledTimes(1)
	})

	it('should invalidate cache if block number is different', async () => {
		let gasPrice = 6
		global.fetch = jest.fn(() => {
			gasPrice = gasPrice + 1
			return Promise.resolve({
				ok: true,
				status: 200,
				json: () =>
					Promise.resolve({
						method: 'eth_gasPrice',
						result: `0x${gasPrice.toString(16)}`,
						jsonrpc: '2.0',
					}),
			})
		}) as any
		let blockNumber = 419n
		const blockchain = {
			getCanonicalHeadBlock: () => {
				blockNumber = blockNumber + 1n
				return Promise.resolve({
					header: {
						number: blockNumber,
					},
				})
			},
		}
		expect(
			await gasPriceHandler({
				vm: { blockchain } as any,
				forkUrl: 'https://mainnet.optimism.io',
			})({}),
		).toBe(7n)
		expect(
			await gasPriceHandler({
				vm: { blockchain } as any,
				forkUrl: 'https://mainnet.optimism.io',
			})({}),
		).toBe(8n)
		expect(global.fetch).toHaveBeenCalledTimes(2)
	})
})
