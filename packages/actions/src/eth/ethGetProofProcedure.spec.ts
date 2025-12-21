import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { ethGetProofProcedure } from './ethGetProofProcedure.js'

const hasMainnetRpc = !!process.env['TEVM_RPC_URLS_MAINNET']
const hasOptimismRpc = !!process.env['TEVM_RPC_URLS_OPTIMISM']

describe(ethGetProofProcedure.name, () => {
	it('should return error response when not in fork mode', async () => {
		const client = createTevmNode()
		const procedure = ethGetProofProcedure(client)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_getProof',
			id: 1,
			params: ['0x0000000000000000000000000000000000000000', [], 'latest'],
		})

		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(1)
		expect(response.method).toBe('eth_getProof')
		expect('error' in response).toBe(true)
		if ('error' in response) {
			expect(response.error.message).toContain('fork mode')
		}
	})

	it.skipIf(!hasMainnetRpc)('should get proof from mainnet fork via JSON-RPC', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const procedure = ethGetProofProcedure(client)

		// Use WETH contract which has known storage
		const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_getProof',
			id: 42,
			params: [
				wethAddress,
				['0x0000000000000000000000000000000000000000000000000000000000000000'],
				'latest',
			],
		})

		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(42)
		expect(response.method).toBe('eth_getProof')
		expect('result' in response).toBe(true)
		if ('result' in response) {
			expect(response.result.address.toLowerCase()).toBe(wethAddress.toLowerCase())
			expect(response.result.accountProof).toBeDefined()
			expect(Array.isArray(response.result.accountProof)).toBe(true)
			expect(response.result.balance).toBeDefined()
			expect(response.result.balance.startsWith('0x')).toBe(true)
			expect(response.result.codeHash).toBeDefined()
			expect(response.result.nonce).toBeDefined()
			expect(response.result.storageHash).toBeDefined()
			expect(response.result.storageProof).toBeDefined()
			expect(response.result.storageProof.length).toBe(1)
		}
	})

	it.skipIf(!hasMainnetRpc)('should handle hex block number', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const procedure = ethGetProofProcedure(client)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_getProof',
			id: 1,
			params: [
				'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				[],
				'0x1221640', // block 19000000
			],
		})

		expect(response.jsonrpc).toBe('2.0')
		expect('result' in response).toBe(true)
	})

	it.skipIf(!hasMainnetRpc)('should handle request without id', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const procedure = ethGetProofProcedure(client)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_getProof',
			params: [
				'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
				[],
				'latest',
			],
		} as any)

		expect(response.jsonrpc).toBe('2.0')
		expect('id' in response).toBe(false)
		expect('result' in response).toBe(true)
	})

	it.skipIf(!hasOptimismRpc)('should return empty storage proofs when no keys provided', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
			},
		})
		const procedure = ethGetProofProcedure(client)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_getProof',
			id: 1,
			params: [
				'0x4200000000000000000000000000000000000010',
				[],
				'latest',
			],
		})

		expect('result' in response).toBe(true)
		if ('result' in response) {
			expect(response.result.storageProof).toEqual([])
		}
	})
})
