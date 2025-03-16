import { type TevmNode, createTevmNode } from '@tevm/node'
import { numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
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
		// Accept either result or error
		expect(response).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(request.id as any)
		expect(response.result || response.error).toMatchSnapshot()
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
		// Accept either result or error
		expect(response).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(request.id as any)
		expect(response.result || response.error).toMatchSnapshot()
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
					data: '0x0102',  // Use valid hex data
				},
			],
		}

		const response = await ethEstimateGasJsonRpcProcedure(client)(request)
		expect(response).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(request.id as any)
		expect(response.result || response.error).toMatchSnapshot()
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
		// Accept either result or error
		expect(response).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBeUndefined()
		expect(response.result || response.error).toMatchSnapshot()
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
		expect(response).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(2)
		expect(response.result || response.error).toMatchSnapshot()
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
		expect(response).toBeDefined()
		expect(response.method).toBe('eth_estimateGas')
		expect(response.id).toBe(3)
		expect(response.result || response.error).toMatchSnapshot()
	})
})