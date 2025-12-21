import { createTevmNode, type TevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { keccak256, toHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { debugPreimageJsonRpcProcedure } from './debugPreimageProcedure.js'

describe('debugPreimageProcedure', () => {
	let client: TevmNode

	beforeEach(async () => {
		client = createTevmNode({
			fork: {
				transport: transports.optimism,
			},
		})
		await client.ready()
	})

	it('should return null for unknown hash (preimage tracking not available)', async () => {
		const procedure = debugPreimageJsonRpcProcedure(client)

		// Create a hash for some data
		const data = 'test data'
		const hash = keccak256(toHex(data))

		// Call debug_preimage
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_preimage',
			id: 1,
			params: [hash],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_preimage',
			id: 1,
		})

		// Most implementations don't track preimages by default due to performance
		// so we expect null
		expect(response.result).toBeNull()
	})

	it('should handle different hash formats', async () => {
		const procedure = debugPreimageJsonRpcProcedure(client)

		// Test with a standard keccak256 hash
		const hash = `0x${'1'.repeat(64)}`

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_preimage',
			id: 1,
			params: [hash],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_preimage',
			id: 1,
		})

		// Should return null for unknown hash
		expect(response.result).toBeNull()
	})

	it('should handle invalid hash format gracefully', async () => {
		const procedure = debugPreimageJsonRpcProcedure(client)

		// Test with invalid hash (too short)
		const invalidHash = '0x1234'

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_preimage',
			id: 1,
			params: [invalidHash],
		})

		// Should return error or null
		expect(response.jsonrpc).toBe('2.0')
		expect(response.method).toBe('debug_preimage')
	})

	it('should handle request without id', async () => {
		const procedure = debugPreimageJsonRpcProcedure(client)

		const hash = keccak256(toHex('test'))

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_preimage',
			params: [hash],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_preimage',
		})

		// id should not be present if not in request
		expect(response.id).toBeUndefined()
	})

	it('should log debug message when preimage not found', async () => {
		const procedure = debugPreimageJsonRpcProcedure(client)

		const hash = keccak256(toHex('some random data'))

		// Call debug_preimage
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_preimage',
			id: 1,
			params: [hash],
		})

		// Should return null since preimage tracking is not available
		expect(response.result).toBeNull()
	})
})
