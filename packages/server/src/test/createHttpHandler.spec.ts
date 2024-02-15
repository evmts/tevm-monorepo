import { createHttpHandler } from '../createHttpHandler.js'
import { DaiContract } from './DaiContract.sol.js'
import { createMemoryClient } from '@tevm/memory-client'
import type { ContractJsonRpcRequest } from '@tevm/procedures-types'
import {
	decodeFunctionResult,
	encodeFunctionData,
	hexToBigInt,
} from '@tevm/utils'
import { describe, expect, it } from 'bun:test'
import supertest from 'supertest'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

describe('createHttpHandler', () => {
	// this doesn't work yet
	// haven't debugged if code is broke or test is broke yet
	// landing immediately to avoid merge conflicts in other prs but need to circle back
	it('should create an http handler', async () => {
		const tevm = await createMemoryClient({
			fork: {
				url: 'https://mainnet.optimism.io',
				blockTag: 115325880n,
			},
		})

		const server = require('http').createServer(createHttpHandler(tevm))

		const req = {
			params: [
				{
					to: contractAddress,
					data: encodeFunctionData(
						DaiContract.read.balanceOf(
							'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
							// this stubbed api is not the correct api atm
							{
								contractAddress,
							},
						),
					),
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		} as const satisfies ContractJsonRpcRequest

		const res = await supertest(server)
			.post('/')
			.send(req)
			.expect(200)
			.expect('Content-Type', /json/)

		console.log(res.body)

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
	})
})
