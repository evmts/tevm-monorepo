import { describe, expect, it } from 'vitest'
import { ReadRequestBodyError } from '../errors/ReadRequestBodyError.js'
import { getRequestBody } from './getRequestBody.js'

describe('getRequestBody', () => {
	it('should read request body from http request with on method', async () => {
		const req = {
			on: (event: string, callback: any) => {
				if (event === 'data') {
					callback(Buffer.from('{"data":"test"}'))
				}
				if (event === 'end') {
					setTimeout(() => callback(), 1)
				}
				return req
			},
		}

		const result = await getRequestBody(req as any)
		expect(result).toBe('{"data":"test"}')
	})

	it('should handle error events from request', async () => {
		const req = {
			on: (event: string, callback: any) => {
				if (event === 'error') {
					setTimeout(() => callback(new Error('test error')), 1)
				}
				return req
			},
		}

		const result = await getRequestBody(req as any)
		expect(result).toBeInstanceOf(ReadRequestBodyError)
	})

	it('should read request body from request with body property', async () => {
		const req = {
			body: '{"data":"test"}',
		}

		const result = await getRequestBody(req as any)
		expect(result).toBe('{"data":"test"}')
	})

	it('should handle invalid request object with no body or on method', async () => {
		const req = {}

		const result = await getRequestBody(req as any)
		expect(result).toBeInstanceOf(ReadRequestBodyError)
		if (result instanceof ReadRequestBodyError) {
			expect(result.message).toContain('Request object is not a valid stream')
		}
	})
})
