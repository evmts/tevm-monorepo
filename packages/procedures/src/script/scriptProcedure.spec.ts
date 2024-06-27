import { beforeEach, describe, expect, it } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { scriptProcedure } from './scriptProcedure.js'
import { ERC20 } from '@tevm/contract'
import { hexToBytes } from '@tevm/utils'
import type { ScriptJsonRpcRequest } from './ScriptJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('scriptProcedure', () => {
	it('should handle valid script request', async () => {
		const request: ScriptJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_script',
			id: 1,
			params: [
				{
					deployedBytecode: ERC20.deployedBytecode,
					data: `0x${hexToBytes(ERC20.bytecode).join('')}`,
				},
			],
		}

		const response = await scriptProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response).toMatchSnapshot()
	})
})
