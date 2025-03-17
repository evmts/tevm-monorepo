import { InvalidRequestError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'
import { describe, expect, it, vi } from 'vitest'
import { handleError } from './handleError.js'

describe('handleError', () => {
	const createMockResponse = () => {
		const res = {
			writeHead: vi.fn(),
			end: vi.fn(),
		}
		return res as any
	}

	it('should handle error with JSON-RPC request id', () => {
		const client = createMemoryClient()
		client.transport.tevm.logger.error = vi.fn() as any
		const error = new InvalidRequestError('Invalid request')
		const res = createMockResponse()
		const jsonRpcReq = { method: 'testMethod', id: 1 }

		handleError(client, error, res, jsonRpcReq)

		expect(client.transport.tevm.logger.error).toHaveBeenCalledWith(error)
		expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })
		expect(res.end).toHaveBeenCalledWith(
			JSON.stringify({
				id: jsonRpcReq.id,
				method: jsonRpcReq.method,
				jsonrpc: '2.0',
				error: {
					code: error.code,
					message: error.message,
				},
			}),
		)
		expect(res.end).toMatchSnapshot()
	})

	it('should handle error without JSON-RPC request id', () => {
		const client = createMemoryClient()
		client.transport.tevm.logger.error = vi.fn() as any
		const error = new InvalidRequestError('Invalid request')
		const res = createMockResponse()
		const jsonRpcReq = { method: 'testMethod' }

		handleError(client, error, res, jsonRpcReq)

		expect(client.transport.tevm.logger.error).toHaveBeenCalledWith(error)
		expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })
		expect(res.end).toHaveBeenCalledWith(
			JSON.stringify({
				method: jsonRpcReq.method,
				jsonrpc: '2.0',
				error: {
					code: error.code,
					message: error.message,
				},
			}),
		)
		expect(res.end).toMatchSnapshot()
	})

	it('should handle error with default method when JSON-RPC request is not provided', () => {
		const client = createMemoryClient()
		client.transport.tevm.logger.error = vi.fn() as any
		const error = new InvalidRequestError('Invalid request')
		const res = createMockResponse()

		handleError(client, error, res)

		expect(client.transport.tevm.logger.error).toHaveBeenCalledWith(error)
		expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })
		expect(res.end).toHaveBeenCalledWith(
			JSON.stringify({
				method: 'unknown',
				jsonrpc: '2.0',
				error: {
					code: error.code,
					message: error.message,
				},
			}),
		)
		expect(res.end).toMatchSnapshot()
	})

	it('should handle error with BigInt values', () => {
		const client = createMemoryClient()
		client.transport.tevm.logger.error = vi.fn() as any

		// Create an error with BigInt properties
		class CustomError extends Error {
			code = -32000
			bigIntValue = 9007199254740991n

			constructor(message: string) {
				super(message)
				this.name = 'CustomError'
			}
		}

		const error = new CustomError('Error with BigInt') as any
		const res = createMockResponse()
		const jsonRpcReq = { method: 'testMethod', id: '123' } // String ID instead of BigInt

		handleError(client, error, res, jsonRpcReq)

		expect(client.transport.tevm.logger.error).toHaveBeenCalledWith(error)
		expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })

		// Check that the response was properly serialized
		const responseData = JSON.parse(res.end.mock.calls[0][0])
		expect(responseData.id).toBe('123')
		expect(responseData.method).toBe('testMethod')
		expect(responseData.error.code).toBe(-32000)
		expect(responseData.error.message).toBe('Error with BigInt')
	})

	it('should handle error with BigInt id in request', () => {
		const client = createMemoryClient()
		client.transport.tevm.logger.error = vi.fn() as any
		const error = new InvalidRequestError('Invalid request')
		const res = createMockResponse()

		// Use a BigInt for the ID - this will test the BigInt serialization in the ID field
		const jsonRpcReq = {
			method: 'testMethod',
			id: 9007199254740991n as unknown as number, // Type cast to make TypeScript happy
		}

		handleError(client, error, res, jsonRpcReq)

		expect(client.transport.tevm.logger.error).toHaveBeenCalledWith(error)
		expect(res.writeHead).toHaveBeenCalledWith(400, { 'Content-Type': 'application/json' })

		// Check that the response was properly serialized with the BigInt converted to a string
		const responseData = JSON.parse(res.end.mock.calls[0][0])
		expect(responseData.id).toBe('9007199254740991')
		expect(responseData.method).toBe('testMethod')
		expect(responseData.error.code).toBe(error.code)
	})
})
