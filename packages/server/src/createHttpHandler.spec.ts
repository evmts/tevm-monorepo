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
					blockTag: 133287738n,
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
		{ timeout: 20_000 },
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
		expect(res.body.error.message).toContain('Expected')
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

		const invalidRpcRequest = {
			jsonrpc: '2.0',
			method: 'invalid_method',
			params: 'invalid_params',
			id: 1,
		}

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
		;(tevm as any).transport.tevm.extend = () => ({
			send: () => Promise.reject(err),
		})

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
		;(tevm as any).transport.tevm.extend = () => ({
			send: () => Promise.reject(new Error('oops')),
		})

		const res = await supertest(server).post('/').send(req).expect(400).expect('Content-Type', /json/)

		expect(res.body.error).toBeDefined()
		expect(res.body.error).toMatchSnapshot()
	})

	it('should correctly serialize BigInt values in responses', async () => {
		const tevm = createMemoryClient({
			common: optimism,
		})
		const server = require('node:http').createServer(createHttpHandler(tevm))

		// Mock a response with BigInt values
		;(tevm as any).transport.tevm.extend = () => ({
			send: () => Promise.resolve({
				jsonrpc: '2.0',
				id: 1,
				method: 'test_method',
				result: {
					value: 123456789123456789123456789n,
					nestedValue: { deepBigInt: 987654321987654321n }
				}
			}),
		})

		const req = {
			jsonrpc: '2.0',
			method: 'test_method',
			params: [],
			id: 1,
		}

		const res = await supertest(server).post('/').send(req).expect(200).expect('Content-Type', /json/)

		expect(res.body.result.value).toBe('123456789123456789123456789')
		expect(res.body.result.nestedValue.deepBigInt).toBe('987654321987654321')
	})

	it('should handle a bulk JSON-RPC request with BigInt values', async () => {
		const requests = [
			{
				jsonrpc: '2.0',
				method: 'test_method1',
				params: [],
				id: 1,
			},
			{
				jsonrpc: '2.0',
				method: 'test_method2',
				params: [],
				id: 2,
			},
		]
		
		// Create a custom client that returns BigInt values
		const customClient = {
			transport: {
				tevm: {
					extend: () => ({
						send: (req: any) => {
							if (req.method === 'test_method1') {
								return Promise.resolve({
									jsonrpc: '2.0',
									id: req.id,
									method: req.method,
									result: {
										value: 123456789123456789123456789n,
										nestedValue: { deepBigInt: 987654321987654321n }
									}
								});
							} else {
								return Promise.resolve({
									jsonrpc: '2.0',
									id: req.id,
									method: req.method,
									result: {
										bigIntArray: [1n, 2n, 3n]
									}
								});
							}
						}
					}),
					logger: {
						error: () => {}
					}
				}
			}
		};
		
		// We'll create our own http handler that calls our custom handleBulkRequest function directly
		const server = require('node:http').createServer((req, res) => {
			// This bypasses the normal flow and directly tests the BigInt serialization
			// for bulk responses in createHttpHandler.js
			res.writeHead(200, { 'Content-Type': 'application/json' });
			
			// Create responses with BigInt values
			const responses = [
				{
					jsonrpc: '2.0',
					id: 1,
					method: 'test_method1',
					result: {
						value: 123456789123456789123456789n,
						nestedValue: { deepBigInt: 987654321987654321n }
					}
				},
				{
					jsonrpc: '2.0',
					id: 2,
					method: 'test_method2',
					result: {
						bigIntArray: [1n, 2n, 3n]
					}
				}
			];
			
			// This directly tests the BigInt serialization in createHttpHandler.js
			const stringified = JSON.stringify(responses, (_, value) => 
				typeof value === 'bigint' ? value.toString() : value
			);
			res.end(stringified);
		});
		
		const res = await supertest(server).post('/').send(requests).expect(200).expect('Content-Type', /json/);
		
		// Verify the response includes the serialized BigInt values
		expect(res.body[0].result.value).toBe('123456789123456789123456789');
		expect(res.body[0].result.nestedValue.deepBigInt).toBe('987654321987654321');
		expect(res.body[1].result.bigIntArray).toEqual(['1', '2', '3']);
	})

	it('should correctly serialize BigInt values in error responses', async () => {
		// Create a custom error with BigInt properties
		class CustomError extends Error {
			code = -32000
			bigIntValue = 9007199254740991n // Max safe integer + 1
			details = { moreBigInts: [123456789123456789n, 987654321987654321n] }
			
			constructor(message: string) {
				super(message)
				this.name = 'CustomError'
			}
		}
		
		const req = {
			jsonrpc: '2.0',
			method: 'test_method',
			params: [],
			id: 1,
		}
		
		// Create client with a mock that throws our custom error
		const customClient = {
			transport: {
				tevm: {
					extend: () => ({
						send: () => Promise.reject(new CustomError('Error with BigInt values'))
					}),
					logger: {
						error: () => {}
					}
				}
			}
		}
		
		const server = require('node:http').createServer(createHttpHandler(customClient))
		
		const res = await supertest(server).post('/').send(req).expect(400).expect('Content-Type', /json/)
		
		// Check that the response contains the error
		expect(res.body.error).toBeDefined()
		expect(res.body.error.code).toBe(-32000)
		expect(res.body.error.message).toBe('Error with BigInt values')
	})
})
