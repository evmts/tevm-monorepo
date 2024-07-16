import { EventEmitter } from 'node:events'
import { IncomingMessage } from 'node:http'
import { describe, expect, it } from 'vitest'
import { ReadRequestBodyError } from '../errors/ReadRequestBodyError.js'
import { getRequestBody } from './getRequestBody.js'

class MockIncomingMessage extends EventEmitter {
	headers: any
	constructor() {
		super()
		this.headers = {}
	}
}

describe('getRequestBody', () => {
	it('should return the request body as a string', async () => {
		const req = new MockIncomingMessage()
		const body = JSON.stringify({ jsonrpc: '2.0', method: 'tevm_call', params: [], id: 1 })

		// Mock the events
		process.nextTick(() => {
			req.emit('data', Buffer.from(body))
			req.emit('end')
		})

		const result = await getRequestBody(req as unknown as IncomingMessage)
		expect(result).toBe(body)
	})

	it('should return a ReadRequestBodyError on request error', async () => {
		const req = new MockIncomingMessage()
		const errorMessage = 'Network error'

		// Mock the events
		process.nextTick(() => {
			req.emit('error', new Error(errorMessage))
		})

		const result = await getRequestBody(req as unknown as IncomingMessage)
		expect(result).toBeInstanceOf(ReadRequestBodyError)
		expect((result as ReadRequestBodyError).cause?.message).toBe(errorMessage)
		expect((result as ReadRequestBodyError).message).toInclude(errorMessage)
		expect(result).toMatchSnapshot()
	})
})
