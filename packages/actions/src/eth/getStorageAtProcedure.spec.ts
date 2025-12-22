import { createTevmNode, type TevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { type Address, numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import type { EthGetStorageAtJsonRpcRequest } from './EthJsonRpcRequest.js'
import { getStorageAtProcedure } from './getStorageAtProcedure.js'

let client: TevmNode
let contractAddress: Address

beforeEach(async () => {
	client = createTevmNode()
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
	contractAddress = deployResult.createdAddress
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	await mineHandler(client)()
})

describe('getStorageAtProcedure', () => {
	it('should return the storage value at a specific position', async () => {
		const request: EthGetStorageAtJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getStorageAt',
			id: 1,
			params: [contractAddress, numberToHex(0), 'latest'],
		}

		const response = await getStorageAtProcedure({
			getVm: client.getVm,
			forkTransport: {
				request: async (req: any) => {
					if (req.method !== 'eth_getStorageAt') {
						throw new Error('Invalid method')
					}
					return numberToHex(420, { size: 32 }) as any
				},
			},
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getStorageAt')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toBe(numberToHex(420, { size: 32 }))
	})

	it('should handle requests without an id', async () => {
		const request: EthGetStorageAtJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getStorageAt',
			params: [contractAddress, numberToHex(0), 'latest'],
		}

		const response = await getStorageAtProcedure({
			getVm: client.getVm,
			forkTransport: {
				request: async (req: any) => {
					if (req.method !== 'eth_getStorageAt') {
						throw new Error('Invalid method')
					}
					return numberToHex(420, { size: 32 }) as any
				},
			},
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getStorageAt')
		expect(response.id).toBeUndefined()
		expect(response.result).toBe(numberToHex(420, { size: 32 }))
	})
})
