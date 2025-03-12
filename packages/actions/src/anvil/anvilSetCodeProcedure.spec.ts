// @ts-nocheck - Disabling TypeScript checks for test file to simplify mocking
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { anvilSetCodeJsonRpcProcedure } from './anvilSetCodeProcedure.js'

// Mock the setAccountProcedure
vi.mock('../SetAccount/setAccountProcedure.js', () => ({
	setAccountProcedure: vi.fn(),
}))

import { setAccountProcedure } from '../SetAccount/setAccountProcedure.js'

describe('anvilSetCodeJsonRpcProcedure', () => {
	const mockClient = {}
	const mockSetAccountProcedureFn = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(setAccountProcedure).mockReturnValue(mockSetAccountProcedureFn)
	})

	it('should set contract code successfully with ID', async () => {
		// Mock successful response from setAccountProcedure
		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			result: { success: true },
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			params: ['0x1234567890123456789012345678901234567890', '0xabcdef'],
			id: 1,
		}

		const procedure = anvilSetCodeJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Verify setAccountProcedure was called correctly
		expect(setAccountProcedure).toHaveBeenCalledWith(mockClient)
		expect(mockSetAccountProcedureFn).toHaveBeenCalledWith({
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			params: [
				{
					address: '0x1234567890123456789012345678901234567890',
					deployedBytecode: '0xabcdef',
				},
			],
			id: 1,
		})

		// Check the result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			result: null,
			id: 1,
		})
	})

	it('should handle requests without an ID', async () => {
		// Mock successful response from setAccountProcedure
		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			result: { success: true },
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			params: ['0x1234567890123456789012345678901234567890', '0xabcdef'],
		}

		const procedure = anvilSetCodeJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Verify setAccountProcedure was called correctly
		expect(mockSetAccountProcedureFn).toHaveBeenCalledWith({
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			params: [
				{
					address: '0x1234567890123456789012345678901234567890',
					deployedBytecode: '0xabcdef',
				},
			],
		})

		// Check the result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			result: null,
		})

		// Verify the ID is not present
		expect(result).not.toHaveProperty('id')
	})

	it('should return an error when setAccountProcedure fails with ID', async () => {
		// Mock error response from setAccountProcedure
		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			error: {
				code: -32602,
				message: 'Invalid address',
			},
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			params: ['invalid_address', '0xabcdef'],
			id: 1,
		}

		const procedure = anvilSetCodeJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Check the error result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			error: {
				code: -32602,
				message: 'Invalid address',
			},
			id: 1,
		})
	})

	it('should return an error when setAccountProcedure fails without ID', async () => {
		// Mock error response from setAccountProcedure
		mockSetAccountProcedureFn.mockResolvedValue({
			jsonrpc: '2.0',
			error: {
				code: -32602,
				message: 'Invalid bytecode',
			},
		})

		const request = {
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			params: ['0x1234567890123456789012345678901234567890', 'invalid_bytecode'],
		}

		const procedure = anvilSetCodeJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Check the error result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setCode',
			error: {
				code: -32602,
				message: 'Invalid bytecode',
			},
		})

		// Verify the ID is not present
		expect(result).not.toHaveProperty('id')
	})
})
