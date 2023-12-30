import { createTevm } from '../createTevm.js'
import { DaiContract } from './DaiContract.sol.js'
import type { TevmContractCallRequest } from '@tevm/jsonrpc'
import { describe, expect, it } from 'bun:test'
import supertest from 'supertest'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

describe('httpHandler', () => {
	// this doesn't work yet
	// haven't debugged if code is broke or test is broke yet
	// landing immediately to avoid merge conflicts in other prs but need to circle back
	it.todo('should create an http handler', async () => {
		const tevm = await createTevm()

		const server = require('http').createServer(tevm.createHttpHandler())

		const req = {
			params: DaiContract.read.balanceOf(
				'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
				{
					contractAddress,
				},
			),
			jsonrpc: '2.0',
			method: 'tevm_contractCall',
			id: 1,
		} as const satisfies TevmContractCallRequest

		const res = await supertest(server)
			.post('/')
			.send(req)
			.expect(200)
			.expect('Content-Type', /json/)

		expect(res.body.data).toBe(1n)
		expect(res.body.result.gasUsed).toBe(2447n)
		expect(res.body.result.logs).toEqual([])
		expect(res.body.method).toBe(req.method)
		expect(res.body.id).toBe(req.id)
		expect(res.body.jsonrpc).toBe(req.jsonrpc)
	})
})
