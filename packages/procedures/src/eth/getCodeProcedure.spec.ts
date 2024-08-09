import { setAccountHandler } from '@tevm/actions'
import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import type { EthGetCodeJsonRpcRequest } from './EthJsonRpcRequest.js'
import { getCodeProcedure } from './getCodeProcedure.js'

describe('getCodeProcedure', () => {
	it('should return the code of a contract', async () => {
		const client = createTevmNode()

		const contract = SimpleContract.withAddress(createAddress(420420).toString())

		await setAccountHandler(client)(contract)

		const request: EthGetCodeJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getCode',
			id: 1,
			params: [contract.address, 'latest'],
		}

		const response = await getCodeProcedure(client)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getCode')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toBe(SimpleContract.deployedBytecode)
	})

	it('should handle requests without an id', async () => {
		const client = createTevmNode()

		const contract = SimpleContract.withAddress(createAddress(420420).toString())

		await setAccountHandler(client)(contract)

		const request: EthGetCodeJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getCode',
			params: [contract.address, 'latest'],
		}

		const response = await getCodeProcedure(client)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getCode')
		expect(response).not.toHaveProperty('id')
		expect(response.result).toBe(SimpleContract.deployedBytecode)
	})
})
