import { createAddress } from '@tevm/address'
import { ERC20 } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { BlockReader, ErrorContract, SimpleContract } from '@tevm/test-utils'
import { type Address, decodeFunctionResult, encodeFunctionData, type Hex, numberToHex, parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import type { CallJsonRpcRequest } from './CallJsonRpcRequest.js'
import { callProcedure } from './callProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('callProcedure', () => {
	it('should handle a basic call', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		await setAccountHandler(client)({
			address,
			balance: 420n,
			nonce: 69n,
			deployedBytecode: ERC20.deployedBytecode,
			state: {
				'0x0': '0x01',
			},
		})

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: address,
					data: encodeFunctionData(ERC20.read.name()),
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle a call with state override', async () => {
		const to = `0x${'69'.repeat(20)}` as const
		const from = `0x${'42'.repeat(20)}` as const
		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to,
					from,
					value: numberToHex(parseEther('.9')),
				},
				{
					[from]: {
						balance: numberToHex(parseEther('1')),
					},
				},
			],
		}

		const response = await callProcedure(client)(request)
		console.log(response.error)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle a call with block override', async () => {
		const blockReaderAddress = createAddress(1234)
		await setAccountHandler(client)({
			address: blockReaderAddress.toString(),
			deployedBytecode: BlockReader.deployedBytecode,
		})

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: blockReaderAddress.toString(),
					data: encodeFunctionData(BlockReader.read.getBlockInfo()),
				},
				{}, // No state override
				{
					number: numberToHex(1000n),
					time: numberToHex(1234567890n),
					coinbase: '0x1000000000000000000000000000000000000000',
					baseFee: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)

		const decodedResult = decodeFunctionResult({
			abi: BlockReader.read.getBlockInfo.abi,
			data: response.result?.rawData as Hex,
			functionName: 'getBlockInfo',
		})
		expect(decodedResult[0]).toBe(1000n)
		expect(decodedResult[1]).toBe(1234567890n)
		expect(decodedResult[2]).toEqualAddress('0x1000000000000000000000000000000000000000')
		expect(decodedResult[3]).toBe(1n)
	})

	it('should handle a call with tracing enabled', async () => {
		const { createdAddress } = await deployHandler(client)(SimpleContract.deploy(0n))
		await mineHandler(client)()

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: createdAddress as Address,
					data: encodeFunctionData(SimpleContract.write.set(100n)),
					createTransaction: true,
					createTrace: true,
					createAccessList: true,
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_call')
		expect(response.result?.logs).toMatchInlineSnapshot(`
[
  {
    "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "data": "0x0000000000000000000000000000000000000000000000000000000000000064",
    "topics": [
      "0x012c78e2b84325878b1bd9d250d772cfe5bda7722d795f45036fa5e1e6e303fc",
    ],
  },
]
`)
		expect(response.id).toBe(request.id as any)
		expect(response.result?.trace).toBeDefined()
		expect(response.result?.trace?.structLogs).toBeInstanceOf(Array)
		expect(response.result?.trace?.structLogs?.length).toBeGreaterThan(0)
		expect(response.result?.trace?.structLogs[0]).toMatchInlineSnapshot(`
{
  "depth": 0,
  "gas": "0x1c970ac",
  "gasCost": "0x6",
  "op": "PUSH1",
  "pc": 0,
  "stack": [],
}
`)
		expect(response.result?.accessList).toMatchInlineSnapshot(`
{
  "0x5fbdb2315678afecb367f032d93f642f64180aa3": [
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  ],
}
`)
	})

	it('should handle errors from callHandler', async () => {
		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: '0x$asdf' as const, // Invalid address
					from: `0x${'42'.repeat(20)}` as const,
					data: '0x0',
					value: numberToHex(500n),
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle errors with a revert', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		await setAccountHandler(client)({
			address,
			balance: 420n,
			nonce: 69n,
			deployedBytecode: ErrorContract.deployedBytecode,
		})

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: address,
					data: encodeFunctionData(ErrorContract.write.revertWithRequireNoMessage),
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toMatchSnapshot()
		expect(response.result).toBeUndefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle errors with a revert message', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		await setAccountHandler(client)({
			address,
			balance: 420n,
			nonce: 69n,
			deployedBytecode: ErrorContract.deployedBytecode,
		})

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: address,
					data: encodeFunctionData(ErrorContract.write.revertWithRequireAndMessage),
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toMatchSnapshot()
		expect(response.result).toBeUndefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle errors with a revert custom error', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		await setAccountHandler(client)({
			address,
			balance: 420n,
			nonce: 69n,
			deployedBytecode: ErrorContract.deployedBytecode,
		})

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: address,
					data: encodeFunctionData(ErrorContract.write.revertWithSimpleCustomError),
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toMatchSnapshot()
		expect(response.result).toBeUndefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
	})
})
