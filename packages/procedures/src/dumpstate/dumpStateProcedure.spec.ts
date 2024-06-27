import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { setAccountHandler } from '@tevm/actions'
import { dumpStateProcedure } from './dumpStateProcedure.js'
import type { DumpStateJsonRpcRequest } from './DumpStateJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('dumpStateProcedure', () => {
	it('should dump the state successfully', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		await setAccountHandler(client)({
			address,
			balance: 420n,
			nonce: 69n,
			deployedBytecode: '0x1234',
			state: {
				'0x0': '0x01',
			},
		})

		const request: DumpStateJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_dumpState',
			id: 1,
		}

		const response = await dumpStateProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_dumpState')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})
})
