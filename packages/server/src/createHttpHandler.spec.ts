import { describe, expect, it } from 'bun:test'
import { optimism } from '@tevm/common'
import { createMemoryClient } from '@tevm/memory-client'
import type { CallJsonRpcRequest } from '@tevm/procedures'
import { transports } from '@tevm/test-utils'
import { decodeFunctionResult, encodeFunctionData, hexToBigInt } from '@tevm/utils'
import supertest from 'supertest'
import { createHttpHandler } from './createHttpHandler.js'
import { DaiContract } from './test/DaiContract.sol.js'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

describe('createHttpHandler', () => {
	it(
		'should create an http handler and handle valid JSON-RPC request',
		async () => {
			const tevm = createMemoryClient({
				common: optimism,
				fork: {
					transport: transports.optimism,
					blockTag: 115325880n,
				},
			})

			const server = require('node:http').createServer(createHttpHandler(tevm))

			const req = {
				params: [
					{
						to: contractAddress,
						data: encodeFunctionData(
							DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d', { contractAddress }),
						),
					},
				],
				jsonrpc: '2.0',
				method: 'tevm_call',
				id: 1,
			} as const satisfies CallJsonRpcRequest

			const res = await supertest(server).post('/').send(req).expect(200).expect('Content-Type', /json/)

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
				blockTag: 115325880n,
			},
		})

		const server = require('node:http').createServer(createHttpHandler(tevm))

		const invalidJson = '{ "jsonrpc": "2.0", "method": "tevm_call", "params": [ ] '

		const res = await supertest(server).post('/').send(invalidJson).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error.code).toBe(-32700)
		expect(res.body.error.message).toMatchSnapshot()
	})

	it('should return 400 for invalid JSON-RPC request', async () => {
		const tevm = createMemoryClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 115325880n,
			},
		})

		const server = require('node:http').createServer(createHttpHandler(tevm))

		const invalidRpcRequest = { jsonrpc: '2.0', method: 'invalid_method', params: 'invalid_params', id: 1 }

		const res = await supertest(server).post('/').send(invalidRpcRequest).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error.code).toBe(-32700)
		expect(res.body.error.message).toMatchSnapshot()
	})
})
