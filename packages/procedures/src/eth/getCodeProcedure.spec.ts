import { beforeEach, describe, expect, it } from 'bun:test'
import { deployHandler, mineHandler } from '@tevm/actions'
import { type BaseClient, createBaseClient } from '@tevm/base-client'
import { SimpleContract } from '@tevm/test-utils'
import { type Address } from '@tevm/utils'
import type { EthGetCodeJsonRpcRequest } from './EthJsonRpcRequest.js'
import { getCodeProcedure } from './getCodeProcedure.js'

let client: BaseClient
let contractAddress: Address

beforeEach(async () => {
	client = createBaseClient()
	const tevmDeploy = deployHandler(client)
	const { bytecode, abi } = SimpleContract
	const deployResult = await tevmDeploy({
		bytecode,
		abi,
		args: [420n],
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	contractAddress = deployResult.createdAddress as Address
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	await mineHandler(client)()
})

describe('getCodeProcedure', () => {
	it('should return the code of a contract', async () => {
		const request: EthGetCodeJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getCode',
			id: 1,
			params: [contractAddress, 'latest'],
		}

		const response = await getCodeProcedure({
			getVm: client.getVm,
			forkClient: {
				request: async (req) => {
					if (req.method !== 'eth_getCode') {
						throw new Error('Invalid method')
					}
					return SimpleContract.bytecode as any
				},
			},
		})(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getCode')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toBe(SimpleContract.deployedBytecode)
	})

	it('should handle requests without an id', async () => {
		const request: EthGetCodeJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getCode',
			params: [contractAddress, 'latest'],
		}

		const response = await getCodeProcedure({
			getVm: client.getVm,
			forkClient: {
				request: async (req) => {
					if (req.method !== 'eth_getCode') {
						throw new Error('Invalid method')
					}
					return SimpleContract.bytecode as any
				},
			},
		})(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getCode')
		expect(response.id).toBeUndefined()
		expect(response.result).toBe(SimpleContract.deployedBytecode)
	})
})
