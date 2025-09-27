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
		expect((result as InvalidJsonError).message).toContain(`Expected ',' or '}' after property value in JSON at position 57`)
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
})
