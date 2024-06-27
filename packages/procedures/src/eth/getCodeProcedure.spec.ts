import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { getCodeProcedure } from './getCodeProcedure.js'
import { mineHandler, deployHandler } from '@tevm/actions'
import { SimpleContract } from '@tevm/test-utils'
import { type Address } from '@tevm/utils'
import type { EthGetCodeJsonRpcRequest } from './EthJsonRpcRequest.js'

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
		expect(response.result).toBe(SimpleContract.bytecode)
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
		expect(response.result).toBe(SimpleContract.bytecode)
	})

	it('should return an error if getCodeHandler fails', async () => {
		const invalidAddress = '0x0000000000000000000000000000000000000000' as Address
		const request: EthGetCodeJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getCode',
			id: 1,
			params: [invalidAddress, 'latest'],
		}

		const response = await getCodeProcedure({
			getVm: client.getVm,
			forkClient: {
				request: async (req) => {
					if (req.method !== 'eth_getCode') {
						throw new Error('Invalid method')
					}
					throw new Error('Invalid address')
				},
			},
		})(request)

		expect(response.method).toBe('eth_getCode')
		expect(response.id).toBe(request.id as any)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})
})
