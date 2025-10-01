import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import type { DumpStateJsonRpcRequest } from './DumpStateJsonRpcRequest.js'
import { dumpStateProcedure } from './dumpStateProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
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
