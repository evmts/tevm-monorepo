import { describe, expect, it, jest } from 'bun:test'
import { InvalidRequestError } from '@tevm/errors'
import { createMemoryClient } from '@tevm/memory-client'
import { handleError } from './handleError.js'

describe('handleError', () => {
	const createMockResponse = () => {
		const res = {
			writeHead: jest.fn(),
			end: jest.fn(),
		}
		return res as any
	}

	it('should handle error with JSON-RPC request id', () => {
		const client = createMemoryClient()
		client.transport.tevm.logger.error = jest.fn()
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
		client.transport.tevm.logger.error = jest.fn()
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
		client.transport.tevm.logger.error = jest.fn()
		const error = new InvalidRequestError('Invalid request')
		const res = createMockResponse()

		handleError(client, error, res)

		expect(client.tevm.logger.error).toHaveBeenCalledWith(error)
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
})
