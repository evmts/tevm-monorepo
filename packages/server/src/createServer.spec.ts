import { beforeEach, describe, expect, it } from 'bun:test'
import { type MemoryClient, createMemoryClient } from '@tevm/memory-client'
import { createServer as createHttpServer } from './createServer.js'

import supertest from 'supertest'

describe('createServer', () => {
	let client: MemoryClient

	beforeEach(() => {
		client = createMemoryClient()
	})

	it('should create a server without options', async () => {
		const server = createHttpServer(client)

		const req = {
			jsonrpc: '2.0',
			method: 'eth_chainId',
			params: [],
			id: 1,
		} as const

		const res = await supertest(server).post('/').send(req).expect(200).expect('Content-Type', /json/)
		expect(res.body).toMatchSnapshot()
	})
})
