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
		expect((result as InvalidJsonError).message).toContain(
			`Expected ',' or '}' after property value in JSON at position 57`,
		)
	})

	it('should return InvalidRequestError for invalid JSON-RPC request', () => {
		const body = JSON.stringify(invalidJsonRpcRequest)
		const result = parseRequest(body)
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toMatchSnapshot()
	})

	it('should reject empty batch requests when disabled', () => {
		const result = parseRequest('[]', { allowEmptyBatch: false })
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toBe('Empty batch requests are invalid')
	})

	it('should reject batches that exceed the configured max size', () => {
		const body = JSON.stringify([validJsonRpcRequest, validJsonRpcRequest])
		const result = parseRequest(body, { maxBatchSize: 1 })
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toBe('Batch request exceeds configured max batch size of 1')
	})

	it('should require jsonrpc version for strict single requests', () => {
		const body = JSON.stringify({ method: 'tevm_call', params: [], id: 1 })
		const result = parseRequest(body, { requireJsonrpc: true })
		expect(result).toBeInstanceOf(InvalidRequestError)
		expect((result as InvalidRequestError).message).toContain('jsonrpc')
	})

	it('should mark invalid strict batch entries without rejecting the whole batch', () => {
		const body = JSON.stringify([validJsonRpcRequest, { method: 'tevm_call', params: [], id: 2 }])
		const result = parseRequest(body, { requireJsonrpc: true })
		expect(Array.isArray(result)).toBe(true)
		const batch = result as Array<any>
		expect(batch[0]).toEqual(validJsonRpcRequest)
		expect(batch[1]).toMatchObject({
			__invalidJsonRpcRequest: true,
			id: 2,
			method: 'tevm_call',
			jsonrpc: '2.0',
		})
		expect(batch[1].error.message).toContain('jsonrpc')
	})

	it('should return InvalidRequestError for invalid bulk JSON-RPC request', () => {
		const body = JSON.stringify([validJsonRpcRequest, invalidJsonRpcRequest])
		const result = parseRequest(body)
		expect(result).toMatchSnapshot()
	})
})
