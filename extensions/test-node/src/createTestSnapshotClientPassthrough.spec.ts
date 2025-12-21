import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http } from 'viem'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'

// Mock the http transport to test different URLs
vi.mock('viem', async () => {
	const actual = await vi.importActual('viem')
	return {
		...actual,
		http: vi.fn((url: string) => {
			return vi.fn(() => ({
				request: vi.fn(async (params) => {
					// Return a response that identifies which URL was used
					return {
						id: params.id || 1,
						jsonrpc: '2.0',
						result: `response-from-${url.replace(/https?:\/\//, '').replace(/[./]/g, '-')}`,
					}
				}),
			}))
		}),
	}
})

describe('createTestSnapshotClient with passthrough', () => {
	const mockHttp = vi.mocked(http)

	beforeEach(() => {
		mockHttp.mockClear()
	})

	it('should use method-specific URLs when configured', async () => {
		const client = createTestSnapshotClient({
			fork: { transport: http('https://mainnet.optimism.io')() },
			test: {
				resolveSnapshotPath: () => '/tmp/test-snapshots.json',
				passthrough: {
					methodUrls: {
						eth_call: 'https://oracle.chainlink.com',
						eth_gasPrice: 'https://gas.polygon.tech',
					},
				},
			},
		})

		await client.server.start()

		// Mock the request to verify the correct URL was used
		const ethCallResponse = await client.request({
			method: 'eth_call',
			params: [{ to: '0x123', data: '0x456' }, 'latest'],
		})

		const ethGasPriceResponse = await client.request({
			method: 'eth_gasPrice',
			params: [],
		})

		// Verify that method-specific URLs were used
		expect(ethCallResponse.result).toBe('response-from-oracle-chainlink-com')
		expect(ethGasPriceResponse.result).toBe('response-from-gas-polygon-tech')

		await client.server.stop()
	})

	it('should use default URL for non-cached methods', async () => {
		const client = createTestSnapshotClient({
			fork: { transport: http('https://mainnet.optimism.io')() },
			test: {
				resolveSnapshotPath: () => '/tmp/test-snapshots.json',
				passthrough: {
					nonCachedMethods: ['eth_blockNumber'],
					defaultUrl: 'https://live.ethereum.org',
				},
			},
		})

		await client.server.start()

		const blockNumberResponse = await client.request({
			method: 'eth_blockNumber',
			params: [],
		})

		expect(blockNumberResponse.result).toBe('response-from-live-ethereum-org')

		await client.server.stop()
	})

	it('should use pattern matching for URLs', async () => {
		const client = createTestSnapshotClient({
			fork: { transport: http('https://mainnet.optimism.io')() },
			test: {
				resolveSnapshotPath: () => '/tmp/test-snapshots.json',
				passthrough: {
					urlPatterns: [
						{
							pattern: /eth_(call|estimateGas)/,
							url: 'https://fast.node.com',
						},
						{
							pattern: /eth_get/,
							url: 'https://getter.node.com',
						},
					],
				},
			},
		})

		await client.server.start()

		const callResponse = await client.request({
			method: 'eth_call',
			params: [{ to: '0x123', data: '0x456' }, 'latest'],
		})

		const estimateGasResponse = await client.request({
			method: 'eth_estimateGas',
			params: [{ to: '0x123', data: '0x456' }],
		})

		const getBalanceResponse = await client.request({
			method: 'eth_getBalance',
			params: ['0x123', 'latest'],
		})

		expect(callResponse.result).toBe('response-from-fast-node-com')
		expect(estimateGasResponse.result).toBe('response-from-fast-node-com')
		expect(getBalanceResponse.result).toBe('response-from-getter-node-com')

		await client.server.stop()
	})

	it('should prioritize method URLs over other configurations', async () => {
		const client = createTestSnapshotClient({
			fork: { transport: http('https://mainnet.optimism.io')() },
			test: {
				resolveSnapshotPath: () => '/tmp/test-snapshots.json',
				passthrough: {
					methodUrls: {
						eth_call: 'https://oracle.specific.com',
					},
					nonCachedMethods: ['eth_call'],
					defaultUrl: 'https://default.node.com',
					urlPatterns: [
						{
							pattern: /eth_call/,
							url: 'https://pattern.node.com',
						},
					],
				},
			},
		})

		await client.server.start()

		const response = await client.request({
			method: 'eth_call',
			params: [{ to: '0x123', data: '0x456' }, 'latest'],
		})

		// Should use method-specific URL, not default or pattern
		expect(response.result).toBe('response-from-oracle-specific-com')

		await client.server.stop()
	})

	it('should fallback to original transport when no passthrough matches', async () => {
		const client = createTestSnapshotClient({
			fork: { transport: http('https://mainnet.optimism.io')() },
			test: {
				resolveSnapshotPath: () => '/tmp/test-snapshots.json',
				passthrough: {
					methodUrls: {
						eth_call: 'https://oracle.chainlink.com',
					},
				},
			},
		})

		await client.server.start()

		// eth_chainId should use original fork transport since it's not in passthrough config
		const chainIdResponse = await client.request({
			method: 'eth_chainId',
			params: [],
		})

		expect(chainIdResponse.result).toBe('response-from-mainnet-optimism-io')

		await client.server.stop()
	})

	it('should throw error when non-cached method has no default URL', async () => {
		expect(() =>
			createTestSnapshotClient({
				fork: { transport: http('https://mainnet.optimism.io')() },
				test: {
					resolveSnapshotPath: () => '/tmp/test-snapshots.json',
					passthrough: {
						nonCachedMethods: ['eth_blockNumber'],
						// No defaultUrl provided
					},
				},
			}),
		).toThrow('Method eth_blockNumber is configured as non-cached but no defaultUrl provided')
	})
})