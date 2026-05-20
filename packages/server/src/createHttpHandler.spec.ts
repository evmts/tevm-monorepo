import type { CallJsonRpcRequest } from '@tevm/actions'
import { optimism } from '@tevm/common'
import { createMemoryClient } from '@tevm/memory-client'
import { TestERC20, transports } from '@tevm/test-utils'
import { decodeFunctionResult, encodeFunctionData, hexToBigInt } from '@tevm/utils'
import { createServer as createNodeHttpServer } from 'node:http'
import supertest from 'supertest'
import { describe, expect, it } from 'vitest'
import { NonceTooLowError } from '../../errors/dist/index.cjs'
import { createHttpHandler } from './createHttpHandler.js'

const DaiContract = TestERC20.withAddress('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1')

describe('createHttpHandler', () => {
	it('should enforce 404 for non-root endpoint in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server).post('/rpc').send({ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 }).expect(404)
	})

	it('should enforce 405 for non-POST in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server).get('/').expect(405).expect('Allow', 'POST')
	})

	it('should enforce 415 for non-json content-type in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server).post('/').set('Content-Type', 'text/plain').send('hello').expect(415)
	})

	it('should enforce 431 for oversized headers in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(
			createHttpHandler(tevm, { compatibility: true, maxHeaderSize: 64 }),
		)
		await supertest(server)
			.post('/')
			.set('Content-Type', 'application/json')
			.set('X-Large', 'a'.repeat(256))
			.send({ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 })
			.expect(431)
	})

	it('should return 413 when request body exceeds max body size in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true, maxBodySize: 8 }))
		await supertest(server)
			.post('/')
			.set('Content-Type', 'application/json')
			.send({ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 })
			.expect(413)
	})

	it('should return 400 for empty batch in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		const res = await supertest(server).post('/').set('Content-Type', 'application/json').send([]).expect(400)
		expect(res.body.error).toBeDefined()
	})

	it('should return 204 for notification-only single request in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server)
			.post('/')
			.set('Content-Type', 'application/json')
			.send({ jsonrpc: '2.0', method: 'eth_chainId', params: [] })
			.expect(204)
	})

	it('should return 204 for notification-only batch in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server)
			.post('/')
			.set('Content-Type', 'application/json')
			.send([
				{ jsonrpc: '2.0', method: 'eth_chainId', params: [] },
				{ jsonrpc: '2.0', method: 'eth_blockNumber', params: [] },
			])
			.expect(204)
	})

	it('should return only non-notification responses for mixed batch in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		const res = await supertest(server)
			.post('/')
			.set('Content-Type', 'application/json')
			.send([
				{ jsonrpc: '2.0', method: 'eth_chainId', params: [] },
				{ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 2 },
			])
			.expect(200)
		expect(Array.isArray(res.body)).toBe(true)
		expect(res.body.length).toBe(1)
		expect(res.body[0].id).toBe(2)
	})

	it('should create an http handler and handle valid JSON-RPC request', async () => {
		const tevm = createMemoryClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 'latest',
			},
		})

		const server = createNodeHttpServer(createHttpHandler(tevm))

		const req = {
			params: [
				{
					to: DaiContract.address,
					data: encodeFunctionData(DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d')),
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		} as const satisfies CallJsonRpcRequest

		const res = await supertest(server).post('/').send(req).expect(200).expect('Content-Type', /json/)
		expect(res.body.error).toBeUndefined()

		expect(
			decodeFunctionResult({
				data: res.body.result.rawData,
				abi: DaiContract.abi,
				functionName: 'balanceOf',
			}),
		).toBe(1n)
		expect(hexToBigInt(res.body.result.executionGasUsed)).toBe(2447n)
		expect(res.body.result.logs).toEqual([])
		expect(res.body.method).toBe(req.method)
		expect(res.body.id).toBe(req.id)
		expect(res.body.jsonrpc).toBe(req.jsonrpc)
	}, 10_000)

	it('should return 400 for invalid JSON', async () => {
		const tevm = createMemoryClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 141866019n,
			},
		})

		const server = createNodeHttpServer(createHttpHandler(tevm))

		const invalidJson = '{ "jsonrpc": "2.0", "method": "tevm_call", "params": [ ] '

		const res = await supertest(server).post('/').send(invalidJson).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error.message).toContain(`Expected ',' or '}' after property value in JSON at position 57`)
	})

	it('should return 400 for invalid JSON-RPC request', async () => {
		const tevm = createMemoryClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 141866019n,
			},
		})

		const server = createNodeHttpServer(createHttpHandler(tevm))

		const invalidRpcRequest = { jsonrpc: '2.0', method: 'invalid_method', params: 'invalid_params', id: 1 }

		const res = await supertest(server).post('/').send(invalidRpcRequest).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error.code).toBe(-32601)
		expect(res.body.error.message).toMatchSnapshot()
	})

	it('should handle a bulk JSON-RPC request', async () => {
		const requests = [
			{
				jsonrpc: '2.0',
				method: 'eth_chainId',
				params: [],
				id: 1,
			},
			{
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 2,
			},
		]
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm))

		const res = await supertest(server).post('/').send(requests).expect(200).expect('Content-Type', /json/)

		expect(res.body).toMatchSnapshot()
	})

	it('should handle an unexpected error during request processing', async () => {
		const req = {
			params: [
				{
					to: DaiContract.address,
					data: encodeFunctionData(DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d')),
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		} as const satisfies CallJsonRpcRequest
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm))

		// Simulate unexpected error by mocking the send method
		const err = new NonceTooLowError('nonce is too low ooops')
		;(tevm as any).transport.tevm.extend = () => ({ send: () => Promise.reject(err) })

		const res = await supertest(server).post('/').send(req).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error.code).toBe(err.code)
		expect(res.body.error.message).toBe(err.message)
	})

	it('should handle an unexpected error during request processing that are not base error', async () => {
		const req = {
			params: [
				{
					to: DaiContract.address,
					data: encodeFunctionData(DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d')),
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		} as const satisfies CallJsonRpcRequest
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm))

		// Simulate unexpected error by mocking the send method
		;(tevm as any).transport.tevm.extend = () => ({ send: () => Promise.reject(new Error('oops')) })

		const res = await supertest(server).post('/').send(req).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error).toMatchSnapshot()
	})

	it('should allow root endpoint with query string in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server)
			.post('/?foo=bar')
			.set('Content-Type', 'application/json')
			.send({ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 })
			.expect(200)
	})

	it('should reject application/jsonp in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server).post('/').set('Content-Type', 'application/jsonp').send('{"jsonrpc":"2.0"}').expect(415)
	})

	it('should return 400 parse errors in compatibility mode', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm, { compatibility: true }))
		await supertest(server).post('/').set('Content-Type', 'application/json').send('{invalid').expect(400)
	})

	it('should preserve legacy transport behavior by default', async () => {
		const tevm = createMemoryClient()
		const server = createNodeHttpServer(createHttpHandler(tevm))
		await supertest(server).get('/rpc').expect(400)
	})
})
