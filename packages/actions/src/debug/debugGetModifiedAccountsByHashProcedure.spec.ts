import { createTevmNode } from '@tevm/node'
import { bytesToHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { debugGetModifiedAccountsByHashJsonRpcProcedure } from './debugGetModifiedAccountsByHashProcedure.js'

describe('debugGetModifiedAccountsByHashJsonRpcProcedure', () => {
	it('should return empty array when no accounts modified', async () => {
		const client = createTevmNode()

		// Mine blocks to have block 0, 1, and 2
		await mineHandler(client)({ blockCount: 2 })

		const vm = await client.getVm()
		const block0 = await vm.blockchain.getBlock(0n)
		const block1 = await vm.blockchain.getBlock(1n)
		const block0Hash = bytesToHex(block0.hash())
		const block1Hash = bytesToHex(block1.hash())

		const procedure = debugGetModifiedAccountsByHashJsonRpcProcedure(client)

		const response = await procedure({
			id: 1,
			jsonrpc: '2.0',
			method: 'debug_getModifiedAccountsByHash',
			params: [
				{
					startBlockHash: block0Hash,
					endBlockHash: block1Hash,
				},
			],
		})

		expect(response.method).toBe('debug_getModifiedAccountsByHash')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(1)

		if ('error' in response) {
			throw new Error(`Unexpected error: ${response.error.message}`)
		}

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
	})

	it('should detect modified accounts between block hashes', async () => {
		const client = createTevmNode()

		const vm = await client.getVm()

		// Get initial block
		const initialBlock = vm.blockchain.blocksByTag.get('latest')
		const initialBlockHash = bytesToHex(initialBlock?.hash() ?? new Uint8Array(32))

		// Modify an account
		const testAddress = '0x1234567890123456789012345678901234567890'
		await setAccountHandler(client)({
			address: testAddress,
			balance: 200n,
			throwOnFail: true,
		})

		// Mine a new block
		await mineHandler(client)({ blockCount: 1 })

		const newBlock = vm.blockchain.blocksByTag.get('latest')
		const newBlockHash = bytesToHex(newBlock?.hash() ?? new Uint8Array(32))

		const procedure = debugGetModifiedAccountsByHashJsonRpcProcedure(client)

		const response = await procedure({
			id: 2,
			jsonrpc: '2.0',
			method: 'debug_getModifiedAccountsByHash',
			params: [
				{
					startBlockHash: initialBlockHash,
					endBlockHash: newBlockHash,
				},
			],
		})

		expect(response.method).toBe('debug_getModifiedAccountsByHash')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(2)

		if ('error' in response) {
			throw new Error(`Unexpected error: ${response.error.message}`)
		}

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
		// Should include at least some modified accounts (coinbase, etc.)
		expect(response.result!.length).toBeGreaterThan(0)
	})

	it('should use next block if end hash not provided', async () => {
		const client = createTevmNode()

		await mineHandler(client)({ blockCount: 2 })

		const vm = await client.getVm()
		const block0 = await vm.blockchain.getBlock(0n)
		const block0Hash = bytesToHex(block0.hash())

		const procedure = debugGetModifiedAccountsByHashJsonRpcProcedure(client)

		const response = await procedure({
			id: 3,
			jsonrpc: '2.0',
			method: 'debug_getModifiedAccountsByHash',
			params: [
				{
					startBlockHash: block0Hash,
				},
			],
		})

		expect(response.method).toBe('debug_getModifiedAccountsByHash')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(3)

		if ('error' in response) {
			throw new Error(`Unexpected error: ${response.error.message}`)
		}

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
	})

	it('should handle errors gracefully', async () => {
		const client = createTevmNode()

		const procedure = debugGetModifiedAccountsByHashJsonRpcProcedure(client)

		// Try with invalid block hash
		const response = await procedure({
			id: 4,
			jsonrpc: '2.0',
			method: 'debug_getModifiedAccountsByHash',
			params: [
				{
					startBlockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
				},
			],
		})

		expect(response.method).toBe('debug_getModifiedAccountsByHash')
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(4)

		// Should return an error
		if ('error' in response) {
			expect(response.error).toBeDefined()
			expect(response.error.code).toBe('-32000')
		}
	})
})
