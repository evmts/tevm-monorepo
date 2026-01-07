import { stringToHex } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import type { EthProtocolVersionJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethProtocolVersionJsonRpcProcedure } from './ethProtocolVersionProcedure.js'

// Mock @tevm/utils's stringToHex function
vi.mock('@tevm/utils', () => ({
	stringToHex: vi.fn((str) => `0x${Buffer.from(str).toString('hex')}`),
}))

describe('ethProtocolVersionJsonRpcProcedure', () => {
	it('should return the protocol version with ID', async () => {
		// Create a mock request with ID
		const request: EthProtocolVersionJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_protocolVersion',
			id: 1,
		}

		// Call the procedure
		const procedure = ethProtocolVersionJsonRpcProcedure()
		const response = await procedure(request)

		// Check that stringToHex was called with the correct argument
		expect(stringToHex).toHaveBeenCalledWith('tevm@1.x.x')

		// Check the response structure
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_protocolVersion',
			result: stringToHex('tevm@1.x.x'),
			id: 1,
		})
	})

	it('should return the protocol version without ID', async () => {
		// Create a mock request without ID
		const request: EthProtocolVersionJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_protocolVersion',
		}

		// Call the procedure
		const procedure = ethProtocolVersionJsonRpcProcedure()
		const response = await procedure(request)

		// Check that stringToHex was called with the correct argument
		expect(stringToHex).toHaveBeenCalledWith('tevm@1.x.x')

		// Check the response structure
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_protocolVersion',
			result: stringToHex('tevm@1.x.x'),
		})

		// Verify the id property is not present
		expect(response).not.toHaveProperty('id')
	})
})
