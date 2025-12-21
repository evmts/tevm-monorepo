import { describe, expect, it } from 'vitest'
import type { PassthroughConfig } from '../types.js'
import { resolvePassthroughTransport, shouldBypassCache } from './resolvePassthroughTransport.js'

describe('resolvePassthroughTransport', () => {
	it('should return undefined when no passthrough config matches', () => {
		const config: PassthroughConfig = {
			methodUrls: { eth_call: 'https://oracle.example.com' },
		}
		
		const result = resolvePassthroughTransport('eth_getBalance', [], config)
		expect(result).toBeUndefined()
	})

	it('should return transport for method-specific URL', () => {
		const config: PassthroughConfig = {
			methodUrls: {
				eth_call: 'https://oracle.example.com',
				eth_gasPrice: 'https://gas.example.com',
			},
		}
		
		const result = resolvePassthroughTransport('eth_call', [], config)
		expect(result).toBeDefined()
		expect(result?.request).toBeDefined()
	})

	it('should return default URL transport for non-cached methods', () => {
		const config: PassthroughConfig = {
			nonCachedMethods: ['eth_blockNumber', 'eth_gasPrice'],
			defaultUrl: 'https://live.example.com',
		}
		
		const result = resolvePassthroughTransport('eth_blockNumber', [], config)
		expect(result).toBeDefined()
		expect(result?.request).toBeDefined()
	})

	it('should throw error when non-cached method has no default URL', () => {
		const config: PassthroughConfig = {
			nonCachedMethods: ['eth_blockNumber'],
			// No defaultUrl provided
		}
		
		expect(() => resolvePassthroughTransport('eth_blockNumber', [], config)).toThrow(
			'Method eth_blockNumber is configured as non-cached but no defaultUrl provided',
		)
	})

	it('should return transport for pattern matches', () => {
		const config: PassthroughConfig = {
			urlPatterns: [
				{
					pattern: /eth_(call|estimateGas)/,
					url: 'https://fast.example.com',
				},
				{
					pattern: /eth_get/,
					url: 'https://getter.example.com',
				},
			],
		}
		
		const callResult = resolvePassthroughTransport('eth_call', [], config)
		expect(callResult).toBeDefined()

		const estimateResult = resolvePassthroughTransport('eth_estimateGas', [], config)
		expect(estimateResult).toBeDefined()

		const getBalanceResult = resolvePassthroughTransport('eth_getBalance', [], config)
		expect(getBalanceResult).toBeDefined()
	})

	it('should prioritize method URLs over non-cached methods', () => {
		const config: PassthroughConfig = {
			methodUrls: { eth_call: 'https://oracle.example.com' },
			nonCachedMethods: ['eth_call'],
			defaultUrl: 'https://default.example.com',
		}
		
		const result = resolvePassthroughTransport('eth_call', [], config)
		expect(result).toBeDefined()
		// Should use methodUrls URL, not default
	})

	it('should prioritize method URLs over pattern matches', () => {
		const config: PassthroughConfig = {
			methodUrls: { eth_call: 'https://oracle.example.com' },
			urlPatterns: [
				{
					pattern: /eth_call/,
					url: 'https://pattern.example.com',
				},
			],
		}
		
		const result = resolvePassthroughTransport('eth_call', [], config)
		expect(result).toBeDefined()
		// Should use methodUrls URL, not pattern URL
	})
})

describe('shouldBypassCache', () => {
	it('should return false when no bypass configuration matches', () => {
		const config: PassthroughConfig = {
			methodUrls: { eth_call: 'https://oracle.example.com' },
		}
		
		const result = shouldBypassCache('eth_getBalance', config)
		expect(result).toBe(false)
	})

	it('should return true for non-cached methods', () => {
		const config: PassthroughConfig = {
			nonCachedMethods: ['eth_blockNumber', 'eth_gasPrice'],
		}
		
		const result = shouldBypassCache('eth_blockNumber', config)
		expect(result).toBe(true)
		
		const result2 = shouldBypassCache('eth_gasPrice', config)
		expect(result2).toBe(true)
		
		const result3 = shouldBypassCache('eth_call', config)
		expect(result3).toBe(false)
	})

	it('should return true for pattern matches with bypassCache=true', () => {
		const config: PassthroughConfig = {
			urlPatterns: [
				{
					pattern: /eth_(call|estimateGas)/,
					url: 'https://fast.example.com',
					bypassCache: true,
				},
				{
					pattern: /eth_get/,
					url: 'https://getter.example.com',
					bypassCache: false,
				},
			],
		}
		
		const callResult = shouldBypassCache('eth_call', config)
		expect(callResult).toBe(true)

		const estimateResult = shouldBypassCache('eth_estimateGas', config)
		expect(estimateResult).toBe(true)

		const getBalanceResult = shouldBypassCache('eth_getBalance', config)
		expect(getBalanceResult).toBe(false) // bypassCache: false
	})

	it('should return false for pattern matches without bypassCache flag', () => {
		const config: PassthroughConfig = {
			urlPatterns: [
				{
					pattern: /eth_call/,
					url: 'https://example.com',
					// No bypassCache flag (defaults to false)
				},
			],
		}
		
		const result = shouldBypassCache('eth_call', config)
		expect(result).toBe(false)
	})

	it('should return true when both nonCachedMethods and urlPatterns apply', () => {
		const config: PassthroughConfig = {
			nonCachedMethods: ['eth_call'],
			urlPatterns: [
				{
					pattern: /eth_call/,
					url: 'https://example.com',
					bypassCache: false, // This should be overridden by nonCachedMethods
				},
			],
		}
		
		const result = shouldBypassCache('eth_call', config)
		expect(result).toBe(true) // nonCachedMethods takes precedence
	})
})