import { describe, expect, it, vi } from 'vitest'
import { createHttpHandler } from './createHttpHandler.js'
import { ReadRequestBodyError } from './errors/ReadRequestBodyError.js'

const { mockGetRequestBody, mockHandleError } = vi.hoisted(() => ({
	mockGetRequestBody: vi.fn(),
	mockHandleError: vi.fn(),
}))

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
		// Create mock client, request, and response
		const mockError = new ReadRequestBodyError('Test error')
		const mockClient = { transport: { tevm: { logger: { error: vi.fn() } } } }
		const mockReq = {}
		const mockRes = {}
		mockGetRequestBody.mockResolvedValueOnce(mockError)

		// Create the handler and call it
		const handler = createHttpHandler(mockClient as any)
		await handler(mockReq as any, mockRes as any)

		// Verify that handleError was called with the expected arguments
		expect(mockGetRequestBody).toHaveBeenCalledWith(mockReq, { maxBodySize: 1024 * 1024 })
		expect(mockHandleError).toHaveBeenCalledWith(mockClient, mockError, mockRes)
	})
})
