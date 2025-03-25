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
	
	const invalidJsonRpcVersion = {
		jsonrpc: '1.0', // Invalid version, should be 2.0
		method: 'tevm_call',
		params: [],
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
	
	it('should return InvalidRequestError for request with invalid ID type', () => {
		const requestWithInvalidId = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			params: [],
			id: { invalid: 'object' } // Invalid ID type (object)
		}
		const body = JSON.stringify(requestWithInvalidId)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toContain('id must be a string, number, or null')
	})

	it('should return InvalidRequestError when bulk request is not an array', () => {
		// Create an object that will be treated as a potential bulk request
		const nonArrayBulkRequest = { 
			0: validJsonRpcRequest, 
			1: validJsonRpcRequest, 
			length: 2 
		}
		const body = JSON.stringify(nonArrayBulkRequest)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		// The object is being validated as a single request, not as bulk
		expect((result as InvalidRequestError).message).toContain('method is required')
	})
	
	// Add tests for other validation paths
	it('should return InvalidRequestError for request with invalid jsonrpc version', () => {
		const body = JSON.stringify(invalidJsonRpcVersion)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toContain('jsonrpc must be \\"2.0\\"')
	})
	
	it('should return InvalidRequestError for request that is not an object', () => {
		const body = JSON.stringify("not an object")
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toContain('Request must be an object')
	})
	
	it('should return InvalidRequestError when bulk request is not correctly formed as an array', () => {
		// This special case will test the bulk request validator directly
		// We use a fake array-like object with properties to force the other branch
		const fakeBulkRequest = {
			0: invalidJsonRpcRequest
		}
		const body = JSON.stringify(fakeBulkRequest)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
	})
})
