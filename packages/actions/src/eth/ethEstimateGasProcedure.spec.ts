import { createAddress } from '@tevm/address'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { ErrorContract } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS, encodeFunctionData, numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import type { EthEstimateGasJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethEstimateGasJsonRpcProcedure } from './ethEstimateGasProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('ethEstimateGasJsonRpcProcedure', () => {
	it('should estimate gas successfully', async () => {
		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 1,
			params: [
				{
					from: '0x0000000000000000000000000000000000000000',
					to: '0x0000000000000000000000000000000000000000',
					data: '0x',
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})
	it('should handle block tag', async () => {
		const latestBlock = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 1,
			params: [
				{
					from: '0x0000000000000000000000000000000000000000',
					to: '0x0000000000000000000000000000000000000000',
					data: '0x',
				},
				numberToHex(latestBlock.header.number),
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle errors from callProcedure', async () => {
		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 1,
			params: [
				{
					to: '0x0000000000000000000000000000000000000000',
					from: '0x0000000000000000000000000000000000000000',
					data: '0xINVALID_DATA',
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.result).toBeUndefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(request.id as any)
		expect(response.error).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			params: [
				{
					to: '0x0000000000000000000000000000000000000000',
					from: '0x0000000000000000000000000000000000000000',
					data: '0x',
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})

	it('should handle error responses when using stateOverrides', async () => {
		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 2,
			params: [
				{
					to: '0x0000000000000000000000000000000000000000',
					from: '0x0000000000000000000000000000000000000000',
					data: '0x',
				},
				'latest',
				{
					'0x0000000000000000000000000000000000000000': {
						balance: '0x1000000000000000000',
					},
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.result).toBeUndefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(2)
		expect(response.error?.code).toBeDefined()
		expect(response.error?.message).toBeDefined()
	})

	it('should handle error responses when using stateOverrides and blockOverrides', async () => {
		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 3,
			params: [
				{
					to: '0x0000000000000000000000000000000000000000',
					from: '0x0000000000000000000000000000000000000000',
					data: '0x',
				},
				'latest',
				{
					'0x0000000000000000000000000000000000000000': {
						balance: '0x1000000000000000000',
					},
				},
				{
					baseFee: '0x1000',
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.result).toBeUndefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(3)
		expect(response.error?.code).toBeDefined()
		expect(response.error?.message).toBeDefined()
	})

	it('should handle basic error decoding when a contract call reverts', async () => {
		const contractAddress = createAddress('0x1234')
		await setAccountHandler(client)({
			address: contractAddress.toString(),
			deployedBytecode: ErrorContract.deployedBytecode,
		})

		const data = encodeFunctionData({
			abi: ErrorContract.abi,
			functionName: 'revertWithRequireNoMessage',
		})

		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 4,
			params: [
				{
					to: contractAddress.toString(),
					from: '0x0000000000000000000000000000000000000000',
					data,
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response.error).toMatchObject({
			code: 3,
			message: 'execution reverted',
			data: {
				data: '0x',
				errors: [
					'revert\n' +
						'\n' +
						'Docs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\n' +
						'Details: {"error":"revert","errorType":"EVMError"}\n' +
						'Version: 1.1.0.next-73',
				],
			},
		})
		expect(response.result).toBeUndefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(4)
	})

	it('should not create transactions or trigger mining during gas estimation', async () => {
		const initialBlock = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const initialBlockNumber = initialBlock.header.number

		const txPool = await client.getTxPool()
		const initialTxPoolSize = txPool.pool.size

		const request: EthEstimateGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 1,
			params: [
				{
					from: PREFUNDED_ACCOUNTS[0].address,
					to: '0x0000000000000000000000000000000000000000',
					data: '0x',
					nonce: '0x1',
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)

		const finalBlock = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const finalBlockNumber = finalBlock.header.number
		const finalTxPoolSize = txPool.pool.size

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(finalBlockNumber).toBe(initialBlockNumber)
		expect(finalTxPoolSize).toBe(initialTxPoolSize)
	})
})
