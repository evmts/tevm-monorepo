import type { CallJsonRpcRequest } from '@tevm/actions'
import { optimism } from '@tevm/common'
import { createMemoryClient } from '@tevm/memory-client'
import { TestERC20, transports } from '@tevm/test-utils'
import { decodeFunctionResult, encodeFunctionData, hexToBigInt } from '@tevm/utils'
import supertest from 'supertest'
import { describe, expect, it } from 'vitest'
import { NonceTooLowError } from '../../errors/dist/index.cjs'
import { createHttpHandler } from './createHttpHandler.js'

const DaiContract = TestERC20.withAddress('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1')

describe('createHttpHandler', () => {
	it(
		'should create an http handler and handle valid JSON-RPC request',
		async () => {
			const tevm = createMemoryClient({
				common: optimism,
				fork: {
					transport: transports.optimism,
					blockTag: 'latest',
				},
			})

			const server = require('node:http').createServer(createHttpHandler(tevm))

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
		},
		{ timeout: 10_000 },
	)

	it('should return 400 for invalid JSON', async () => {
		const tevm = createMemoryClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 141866019n,
			},
		})

		const server = require('node:http').createServer(createHttpHandler(tevm))

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

		const server = require('node:http').createServer(createHttpHandler(tevm))

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
		const server = require('node:http').createServer(createHttpHandler(tevm))

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
		const server = require('node:http').createServer(createHttpHandler(tevm))

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
		const server = require('node:http').createServer(createHttpHandler(tevm))

		// Simulate unexpected error by mocking the send method
		;(tevm as any).transport.tevm.extend = () => ({ send: () => Promise.reject(new Error('oops')) })

		const res = await supertest(server).post('/').send(req).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error).toMatchSnapshot()
	})

	it('should not serialize Promise objects in eth_getBlockByNumber response', async () => {
		const tevm = createMemoryClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 'latest',
			},
		})

		const server = require('node:http').createServer(createHttpHandler(tevm))

		// First get the latest block number
		const blockNumberReq = {
			jsonrpc: '2.0',
			method: 'eth_blockNumber',
			params: [],
			id: 1,
		} as const

		const blockNumberRes = await supertest(server)
			.post('/')
			.send(blockNumberReq)
			.expect(200)
			.expect('Content-Type', /json/)

		expect(blockNumberRes.body.result).toMatch(/^0x/)

		// Now get the block details using that block number
		const getBlockReq = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			params: [blockNumberRes.body.result, false],
			id: 2,
		} as const

		const res = await supertest(server).post('/').send(getBlockReq).expect(200).expect('Content-Type', /json/)

		expect(res.body.error).toBeUndefined()
		expect(res.body.result).toBeDefined()

		// The bug was that result contained a Promise object which serializes to {}
		expect(res.body.result).not.toEqual({})
		expect(typeof res.body.result).toBe('object')
		expect(res.body.result).not.toBeInstanceOf(Promise)

		// Verify the response has the expected block properties
		expect(res.body.result).toHaveProperty('number')
		expect(res.body.result).toHaveProperty('hash')
		expect(res.body.result).toHaveProperty('parentHash')
		expect(res.body.result).toHaveProperty('transactions')
		expect(res.body.result.number).toMatch(/^0x/)
		expect(res.body.result.hash).toMatch(/^0x/)

		// Verify basic response structure
		expect(res.body.method).toBe('eth_getBlockByNumber')
		expect(res.body.id).toBe(2)
		expect(res.body.jsonrpc).toBe('2.0')
	}, { timeout: 10_000 })
})
