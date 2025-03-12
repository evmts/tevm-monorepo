// @ts-nocheck - Disabling TypeScript checks for test file to simplify mocking
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { anvilSetStorageAtJsonRpcProcedure } from './anvilSetStorageAtProcedure.js'

// Mock the setAccountProcedure
vi.mock('../SetAccount/setAccountProcedure.js', () => ({
	setAccountProcedure: vi.fn(),
}))

import { setAccountProcedure } from '../SetAccount/setAccountProcedure.js'

describe('anvilSetStorageAtJsonRpcProcedure', () => {
	const mockClient = {}
	const mockSetAccountProcedureFn = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(setAccountProcedure).mockReturnValue(mockSetAccountProcedureFn)
	})

	it('should set storage at specified location successfully with ID', async () => {
		// Mock successful response from setAccountProcedure
		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			result: { success: true },
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			params: [
				'0x1234567890123456789012345678901234567890', // address
				'0x01', // storage key
				'0xabcdef', // storage value
			],
			id: 1,
		}

		const procedure = anvilSetStorageAtJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Verify setAccountProcedure was called correctly
		expect(setAccountProcedure).toHaveBeenCalledWith(mockClient)
		expect(mockSetAccountProcedureFn).toHaveBeenCalledWith({
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			params: [
				{
					address: '0x1234567890123456789012345678901234567890',
					stateDiff: {
						'0x01': '0xabcdef',
					},
				},
			],
			id: 1,
		})

		// Check the result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			result: null,
			id: 1,
		})
	})

	it('should set storage at specified location successfully without ID', async () => {
		// Mock successful response from setAccountProcedure
		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			result: { success: true },
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			params: [
				'0x1234567890123456789012345678901234567890', // address
				'0x01', // storage key
				'0xabcdef', // storage value
			],
		}

		const procedure = anvilSetStorageAtJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Verify setAccountProcedure was called correctly
		expect(mockSetAccountProcedureFn).toHaveBeenCalledWith({
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			params: [
				{
					address: '0x1234567890123456789012345678901234567890',
					stateDiff: {
						'0x01': '0xabcdef',
					},
				},
			],
		})

		// Check the result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			result: null,
		})

		// Verify ID is not present
		expect(result).not.toHaveProperty('id')
	})

	it('should return error when setAccountProcedure fails with ID', async () => {
		// Mock error response from setAccountProcedure
		const errorResponse = {
			code: -32602,
			message: 'Invalid address',
		}

		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			error: errorResponse,
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			params: [
				'invalid_address', // invalid address
				'0x01', // storage key
				'0xabcdef', // storage value
			],
			id: 1,
		}

		const procedure = anvilSetStorageAtJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Check the error result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			error: errorResponse,
			id: 1,
		})
	})

	it('should return error when setAccountProcedure fails without ID', async () => {
		// Mock error response from setAccountProcedure
		const errorResponse = {
			code: -32602,
			message: 'Invalid storage key',
		}

		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			error: errorResponse,
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			params: [
				'0x1234567890123456789012345678901234567890', // address
				'invalid_key', // invalid storage key
				'0xabcdef', // storage value
			],
		}

		const procedure = anvilSetStorageAtJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Check the error result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setStorageAt',
			error: errorResponse,
		})

		// Verify ID is not present
		expect(result).not.toHaveProperty('id')
	})
})
