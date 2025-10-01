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
				blockTag: 141658503n,
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
				blockTag: 141658503n,
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
})
