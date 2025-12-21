import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { ethGetProofHandler } from './ethGetProofHandler.js'

const hasMainnetRpc = !!process.env['TEVM_RPC_URLS_MAINNET']
const hasOptimismRpc = !!process.env['TEVM_RPC_URLS_OPTIMISM']

describe(ethGetProofHandler.name, () => {
	it('should throw NoForkUrlSetError when not in fork mode', async () => {
		const client = createTevmNode()
		const handler = ethGetProofHandler(client)

		await expect(
			handler({
				address: '0x0000000000000000000000000000000000000000',
				storageKeys: [],
			}),
		).rejects.toThrow('eth_getProof is only supported in fork mode')
	})

	it.skipIf(!hasMainnetRpc)('should get proof from mainnet fork', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		// Use WETH contract which has known storage
		const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
		const result = await handler({
			address: wethAddress,
			storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
			blockTag: 'latest',
		})

		expect(result.address.toLowerCase()).toBe(wethAddress.toLowerCase())
		expect(result.accountProof).toBeDefined()
		expect(Array.isArray(result.accountProof)).toBe(true)
		expect(result.accountProof.length).toBeGreaterThan(0)
		expect(result.balance).toBeDefined()
		expect(typeof result.balance).toBe('string')
		expect(result.balance.startsWith('0x')).toBe(true)
		expect(result.codeHash).toBeDefined()
		expect(result.nonce).toBeDefined()
		expect(result.storageHash).toBeDefined()
		expect(result.storageProof).toBeDefined()
		expect(Array.isArray(result.storageProof)).toBe(true)
		expect(result.storageProof.length).toBe(1)
		expect(result.storageProof[0]?.key).toBeDefined()
		expect(result.storageProof[0]?.value).toBeDefined()
		expect(result.storageProof[0]?.proof).toBeDefined()
	})

	it.skipIf(!hasOptimismRpc)('should get proof from Optimism fork', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
			},
		})
		const handler = ethGetProofHandler(client)

		// Use L2 Bridge contract on Optimism
		const bridgeAddress = '0x4200000000000000000000000000000000000010'
		const result = await handler({
			address: bridgeAddress,
			storageKeys: [],
			blockTag: 'latest',
		})

		expect(result.address.toLowerCase()).toBe(bridgeAddress.toLowerCase())
		expect(result.accountProof).toBeDefined()
		expect(Array.isArray(result.accountProof)).toBe(true)
		expect(result.storageProof).toEqual([])
	})

	it.skipIf(!hasMainnetRpc)('should handle empty account (zero balance, no code)', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		// Use zero address which should be empty
		const result = await handler({
			address: '0x0000000000000000000000000000000000000001',
			storageKeys: [],
			blockTag: 'latest',
		})

		expect(result.address.toLowerCase()).toBe('0x0000000000000000000000000000000000000001')
		expect(result.accountProof).toBeDefined()
	})

	it.skipIf(!hasMainnetRpc)('should handle multiple storage keys', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		// Use WETH contract
		const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
		const result = await handler({
			address: wethAddress,
			storageKeys: [
				'0x0000000000000000000000000000000000000000000000000000000000000000',
				'0x0000000000000000000000000000000000000000000000000000000000000001',
			],
			blockTag: 'latest',
		})

		expect(result.storageProof.length).toBe(2)
	})

	it.skipIf(!hasMainnetRpc)('should handle bigint blockTag', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		// Use an older block number
		const result = await handler({
			address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			storageKeys: [],
			blockTag: 19000000n,
		})

		expect(result.address).toBeDefined()
		expect(result.accountProof).toBeDefined()
	})

	it.skipIf(!hasMainnetRpc)('should handle string blockTag "earliest"', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		const result = await handler({
			address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			storageKeys: [],
			blockTag: 'earliest',
		})

		expect(result.address).toBeDefined()
		expect(result.accountProof).toBeDefined()
	})

	it.skipIf(!hasMainnetRpc)('should handle string blockTag "pending"', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		const result = await handler({
			address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			storageKeys: [],
			blockTag: 'pending',
		})

		expect(result.address).toBeDefined()
		expect(result.accountProof).toBeDefined()
	})

	it.skipIf(!hasMainnetRpc)('should handle default blockTag (latest)', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		// Not providing blockTag should default to 'latest'
		const result = await handler({
			address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			storageKeys: [],
		})

		expect(result.address).toBeDefined()
		expect(result.accountProof).toBeDefined()
	})

	it.skipIf(!hasMainnetRpc)('should properly format all result fields', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
		const storageKey = '0x0000000000000000000000000000000000000000000000000000000000000000'
		const result = await handler({
			address: wethAddress,
			storageKeys: [storageKey],
			blockTag: 'latest',
		})

		// Verify all result fields exist and have correct format
		expect(result.address).toBe(wethAddress)
		expect(result.accountProof).toBeDefined()
		expect(Array.isArray(result.accountProof)).toBe(true)
		expect(result.balance).toMatch(/^0x[0-9a-fA-F]+$/)
		expect(result.codeHash).toMatch(/^0x[0-9a-fA-F]{64}$/)
		expect(result.nonce).toMatch(/^0x[0-9a-fA-F]+$/)
		expect(result.storageHash).toMatch(/^0x[0-9a-fA-F]{64}$/)
		expect(result.storageProof).toBeDefined()
		expect(Array.isArray(result.storageProof)).toBe(true)
		expect(result.storageProof[0]).toMatchObject({
			key: expect.stringMatching(/^0x[0-9a-fA-F]+$/),
			value: expect.stringMatching(/^0x[0-9a-fA-F]+$/),
			proof: expect.arrayContaining([expect.stringMatching(/^0x[0-9a-fA-F]+$/)]),
		})
	})

	it.skipIf(!hasMainnetRpc)('should handle RPC error from fork transport', async () => {
		const client = createTevmNode({
			fork: {
				transport: {
					request: async () => ({
						jsonrpc: '2.0',
						id: 1,
						error: {
							code: -32000,
							message: 'Test RPC error',
						},
					}),
				},
			},
		})
		const handler = ethGetProofHandler(client)

		await expect(
			handler({
				address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				storageKeys: [],
				blockTag: 'latest',
			}),
		).rejects.toThrow('Test RPC error')
	})

	it.skipIf(!hasMainnetRpc)('should correctly map storage proof array elements', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const handler = ethGetProofHandler(client)

		const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
		const storageKeys = [
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x0000000000000000000000000000000000000000000000000000000000000001',
			'0x0000000000000000000000000000000000000000000000000000000000000002',
		]
		const result = await handler({
			address: wethAddress,
			storageKeys,
			blockTag: 'latest',
		})

		// Verify each storage proof is properly mapped
		expect(result.storageProof.length).toBe(3)
		for (let i = 0; i < result.storageProof.length; i++) {
			const proof = result.storageProof[i]
			expect(proof).toBeDefined()
			expect(proof.key).toBeDefined()
			expect(proof.value).toBeDefined()
			expect(proof.proof).toBeDefined()
			expect(Array.isArray(proof.proof)).toBe(true)
		}
	})
})
