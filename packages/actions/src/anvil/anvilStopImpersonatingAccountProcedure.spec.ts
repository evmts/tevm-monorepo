// @ts-nocheck - Disabling TypeScript checks for test file to simplify mocking
import { describe, expect, it, vi } from 'vitest'
import { anvilStopImpersonatingAccountJsonRpcProcedure } from './anvilStopImpersonatingAccountProcedure.js'

describe('anvilStopImpersonatingAccountJsonRpcProcedure', () => {
	it('should clear the impersonated account and return null', async () => {
		// Mock client
		const mockClient = {
			setImpersonatedAccount: vi.fn(),
		}

		// Mock request with ID
		const request = {
			jsonrpc: '2.0',
			method: 'anvil_stopImpersonatingAccount',
			id: 1,
		}

		// Call procedure
		const procedure = anvilStopImpersonatingAccountJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Check that the impersonated account was set to undefined
		expect(mockClient.setImpersonatedAccount).toHaveBeenCalledWith(undefined)

		// Check the response structure
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_stopImpersonatingAccount',
			result: null,
			id: 1,
		})
	})

	it('should handle requests without an ID', async () => {
		// Mock client
		const mockClient = {
			setImpersonatedAccount: vi.fn(),
		}

		// Mock request without ID
		const request = {
			jsonrpc: '2.0',
			method: 'anvil_stopImpersonatingAccount',
		}

		// Call procedure
		const procedure = anvilStopImpersonatingAccountJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Check that the impersonated account was set to undefined
		expect(mockClient.setImpersonatedAccount).toHaveBeenCalledWith(undefined)

		// Check the response structure
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_stopImpersonatingAccount',
			result: null,
		})

		// Verify the id property is not present
		expect(response).not.toHaveProperty('id')
	})
})
