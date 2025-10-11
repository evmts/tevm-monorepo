import { http } from 'viem'
import { describe, expect, it } from 'vitest'
import type { ForkOptions } from './ForkOptions.js'

describe('ForkOptions', () => {
	it('should accept minimal fork options with transport only', () => {
		const options: ForkOptions = {
			transport: http('https://mainnet.infura.io/v3/your-api-key'),
		}
		expect(options.transport).toBeDefined()
		expect(options.blockTag).toBeUndefined()
		expect(options.chainId).toBeUndefined()
	})

	it('should accept fork options with blockTag', () => {
		const options: ForkOptions = {
			transport: http('https://mainnet.infura.io/v3/your-api-key'),
			blockTag: 'latest',
		}
		expect(options.transport).toBeDefined()
		expect(options.blockTag).toBe('latest')
		expect(options.chainId).toBeUndefined()
	})

	it('should accept fork options with custom chainId', () => {
		const customChainId = 999
		const options: ForkOptions = {
			transport: http('https://mainnet.infura.io/v3/your-api-key'),
			chainId: customChainId,
		}
		expect(options.transport).toBeDefined()
		expect(options.chainId).toBe(customChainId)
		expect(options.blockTag).toBeUndefined()
	})

	it('should accept fork options with all properties', () => {
		const customChainId = 1337
		const options: ForkOptions = {
			transport: http('https://mainnet.infura.io/v3/your-api-key'),
			blockTag: 12345678n,
			chainId: customChainId,
		}
		expect(options.transport).toBeDefined()
		expect(options.blockTag).toBe(12345678n)
		expect(options.chainId).toBe(customChainId)
	})

	it('should enforce number type for chainId', () => {
		// This test verifies TypeScript compilation - if it compiles, the types are correct
		const validChainId: number = 1337
		const options: ForkOptions = {
			transport: http('https://mainnet.infura.io/v3/your-api-key'),
			chainId: validChainId,
		}
		expect(typeof options.chainId).toBe('number')
	})
})