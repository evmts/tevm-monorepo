import { createServer } from 'node:http'
import { createMemoryClient } from '@tevm/memory-client'
import type { NextApiHandler } from 'next'
import supertest from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { createNextApiHandler } from './createNextApiHandler.js'

describe('createNextApiHandler', () => {
	let handler: NextApiHandler

	beforeEach(() => {
		handler = createNextApiHandler(createMemoryClient())
	})

	it('should handle valid JSON-RPC request', async () => {
		const server = createServer((req, res) => handler(req as any, res as any))

		const req = {
			jsonrpc: '2.0',
			method: 'eth_chainId',
			params: [],
			id: 1,
		} as const

		const res = await supertest(server).post('/').send(req).expect(200).expect('Content-Type', /json/)

		expect(res.body).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_chainId',
			result: '0x384',
		})
	})

	it('should return 400 for invalid JSON', async () => {
		const server = createServer((req, res) => handler(req as any, res as any))

		const invalidJson = '{ "jsonrpc": "2.0", "method": "eth_chainId", "params": [ ] '

		const res = await supertest(server).post('/').send(invalidJson).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error.code).toBe(-32700)
		expect(res.body.error.message).toContain(`Expected ',' or '}' after property value in JSON at position 59`)
	})

	it('should return 400 for invalid JSON-RPC request', async () => {
		const server = createServer((req, res) => handler(req as any, res as any))

		const invalidRpcRequest = { jsonrpc: '2.0', method: 'invalid_method', params: 'invalid_params', id: 1 }

		const res = await supertest(server).post('/').send(invalidRpcRequest).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error.code).toBe(-32601)
		expect(res.body.error.message).toMatchSnapshot()
	})
})
