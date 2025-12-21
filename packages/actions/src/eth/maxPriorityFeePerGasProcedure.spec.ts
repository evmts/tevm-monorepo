import { describe, expect, it } from 'vitest'
import { maxPriorityFeePerGasProcedure } from './maxPriorityFeePerGasProcedure.js'

describe(maxPriorityFeePerGasProcedure.name, () => {
	it('should return 1 gwei in hex when no fork transport', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		const procedure = maxPriorityFeePerGasProcedure({
			getVm: () => ({ blockchain }) as any,
			forkTransport: undefined,
		} as any)
		const result = await procedure({
			jsonrpc: '2.0',
			method: 'eth_maxPriorityFeePerGas',
			id: 1,
			params: [],
		} as any)
		expect(result.result).toBe('0x3b9aca00') // 1 gwei in hex
		expect(result.jsonrpc).toBe('2.0')
		expect(result.id).toBe(1)
		expect(result.method).toBe('eth_maxPriorityFeePerGas')
	})

	it('should not include id in response when request has no id', async () => {
		const blockchain = {
			getCanonicalHeadBlock: () =>
				Promise.resolve({
					header: {
						number: 420n,
					},
				}),
		}
		const procedure = maxPriorityFeePerGasProcedure({
			getVm: () => ({ blockchain }) as any,
			forkTransport: undefined,
		} as any)
		const result = await procedure({
			jsonrpc: '2.0',
			method: 'eth_maxPriorityFeePerGas',
			params: [],
		} as any)
		expect(result.id).toBeUndefined()
	})
})
