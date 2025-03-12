import { describe, expect, it, vi } from 'vitest'
import { ReadRequestBodyError } from './errors/ReadRequestBodyError.js'

// Define mocks outside test scope since vi.mock is hoisted
const mockError = new ReadRequestBodyError('Test error')
const mockGetRequestBody = vi.fn().mockResolvedValue(mockError)
const mockHandleError = vi.fn()

// Mock the required modules
vi.mock('./internal/getRequestBody.js', () => ({
	getRequestBody: mockGetRequestBody,
}))

vi.mock('./internal/handleError.js', () => ({
	handleError: mockHandleError,
}))

// Direct test for lines 46-47 in createHttpHandler.js
describe('createHttpHandler direct tests', () => {
	it('should handle ReadRequestBodyError', async () => {
		// Import the module after mocks are set up
		const { createHttpHandler } = await import('./createHttpHandler.js')

		// Create mock client, request, and response
		const mockClient = { transport: { tevm: { logger: { error: vi.fn() } } } }
		const mockReq = {}
		const mockRes = {}

		// Create the handler and call it
		const handler = createHttpHandler(mockClient as any)
		await handler(mockReq as any, mockRes as any)

		// Verify that handleError was called with the expected arguments
		expect(mockGetRequestBody).toHaveBeenCalledWith(mockReq)
		expect(mockHandleError).toHaveBeenCalledWith(mockClient, mockError, mockRes)

		// Reset mocks
		vi.resetModules()
	})
})
