import { InvalidRequestError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import { InvalidJsonError } from '../errors/InvalidJsonError.js'
import { parseRequest } from './parseRequest.js'

describe('parseRequest', () => {
	const validJsonRpcRequest = {
		jsonrpc: '2.0',
		method: 'tevm_call',
		params: [],
		id: 1,
	} as const

	const invalidJsonRpcRequest = {
		jsonrpc: '2.0',
		id: 1,
	} as const

	it('should parse a valid single JSON-RPC request', () => {
		const body = JSON.stringify(validJsonRpcRequest)
		const result = parseRequest(body)
		expect(result).toEqual(validJsonRpcRequest)
	})

	it('should parse a valid bulk JSON-RPC request', () => {
		const body = JSON.stringify([validJsonRpcRequest, validJsonRpcRequest])
		const result = parseRequest(body)
		expect(result).toEqual([validJsonRpcRequest, validJsonRpcRequest])
	})

	it('should return InvalidJsonError for invalid JSON', () => {
		const body = '{ "jsonrpc": "2.0", "method": "tevm_call", "params": [ ] ' // Malformed JSON
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidJsonError)
		expect((result as InvalidJsonError).message).toMatchSnapshot()
	})

	it('should return InvalidRequestError for invalid JSON-RPC request', () => {
		const body = JSON.stringify(invalidJsonRpcRequest)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toMatchSnapshot()
	})

	it('should return InvalidRequestError for invalid bulk JSON-RPC request', () => {
		const body = JSON.stringify([validJsonRpcRequest, invalidJsonRpcRequest])
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toMatchSnapshot()
	})

	it('should handle non-object request data', () => {
		const body = JSON.stringify('not an object')
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toContain('Request must be an object')
	})

	it('should validate a request with an invalid jsonrpc version', () => {
		const invalidJsonrpcVersion = {
			jsonrpc: '1.0', // Invalid version
			method: 'tevm_call',
			params: [],
			id: 1,
		}
		const body = JSON.stringify(invalidJsonrpcVersion)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		// The message is a stringified JSON with the errors inside
		expect((result as InvalidRequestError).message).toContain('"jsonrpc must be \\"2.0\\""')
	})

	it('should validate a request with an invalid id type', () => {
		const invalidIdType = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			params: [],
			id: {}, // Invalid ID type (should be string, number, or null)
		}
		const body = JSON.stringify(invalidIdType)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toContain('"id must be a string, number, or null"')
	})

	it('should validate a request with null ID', () => {
		const validNullId = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			params: [],
			id: null, // Valid ID type
		}
		const body = JSON.stringify(validNullId)
		const result = parseRequest(body)
		expect(result).toEqual(validNullId)
	})

	it('should validate that bulk request is an array', () => {
		// Simulate a non-array bulk request by sending a non-array with isBulk=true
		// This will test the bulk request validation path in parseRequest
		const result = parseRequest(JSON.stringify({ foo: 'bar' }), true)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toContain('Bulk request must be an array')
	})
})
