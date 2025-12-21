import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, isHex, numberToHex, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethSimulateV1Procedure } from './ethSimulateV1Procedure.js'

describe('ethSimulateV1Procedure', () => {
	it('should simulate a simple call and return JSON-RPC formatted response', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000000',
									value: numberToHex(0n),
								},
							],
						},
					],
				},
			],
		})

		expect(response.jsonrpc).toBe('2.0')
		expect(response.method).toBe('eth_simulateV1')
		expect(response.id).toBe(1)
		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
		expect(response.result?.length).toBe(1)
		expect(response.result?.[0]?.calls.length).toBe(1)
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should handle request without ID field', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000000',
								},
							],
						},
					],
				},
			],
		})

		expect(response.id).toBeUndefined()
		expect(response.jsonrpc).toBe('2.0')
		expect(response.method).toBe('eth_simulateV1')
	})

	it('should convert hex values to bigint for handler', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000001',
									value: numberToHex(1000n),
									gas: numberToHex(50000n),
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should handle blockOverrides with number conversion', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							blockOverrides: {
								number: numberToHex(100n),
								time: numberToHex(1234567890n),
								gasLimit: numberToHex(30000000n),
								baseFeePerGas: numberToHex(1000n),
							},
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000000',
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
		expect(isHex(response.result?.[0]?.timestamp ?? '')).toBe(true)
	})

	it('should handle stateOverrides with balance', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const targetAddress = '0x1111111111111111111111111111111111111111' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
								},
								[targetAddress]: {
									balance: numberToHex(5n ** 18n),
								},
							},
							calls: [
								{
									from: testAddress,
									to: targetAddress,
									value: numberToHex(1000n),
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should handle stateOverrides with code', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const contractAddress = '0x2222222222222222222222222222222222222222' as const
		const bytecode = '0x6080604052348015600f57600080fd5b506000548060005260206000f3' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
								},
								[contractAddress]: {
									code: bytecode,
								},
							},
							calls: [
								{
									from: testAddress,
									to: contractAddress,
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should simulate multiple calls in a single block', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000001',
								},
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000002',
								},
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000003',
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls.length).toBe(3)
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
		expect(response.result?.[0]?.calls[1]?.status).toBe(numberToHex(1n))
		expect(response.result?.[0]?.calls[2]?.status).toBe(numberToHex(1n))
	})

	it('should simulate multiple blocks', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000001',
								},
							],
						},
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000002',
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.length).toBe(2)
		expect(response.result?.[0]?.calls.length).toBe(1)
		expect(response.result?.[1]?.calls.length).toBe(1)
	})

	it('should include logs in response with proper formatting', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
								},
							},
							calls: [
								{
									from: testAddress,
									data: encodeDeployData(SimpleContract.deploy(42n)),
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.logs).toBeDefined()
		expect(Array.isArray(response.result?.[0]?.calls[0]?.logs)).toBe(true)
	})

	it('should handle failed calls and include error information', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const revertingBytecode = '0x60006000fd' as const // PUSH1 0x00 PUSH1 0x00 REVERT
		const contractAddress = '0x3333333333333333333333333333333333333333' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
								},
								[contractAddress]: {
									code: revertingBytecode,
								},
							},
							calls: [
								{
									from: testAddress,
									to: contractAddress,
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(0n))
		expect(response.result?.[0]?.calls[0]?.error).toBeDefined()
	})

	it('should return error response when handler throws', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		// Pass invalid params to trigger error
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			// @ts-expect-error - Testing error case
			params: [
				{
					blockStateCalls: [],
				},
			],
		})

		expect(response.error).toBeDefined()
		expect(response.error?.code).toBe(-32603)
		expect(response.error?.message).toBeDefined()
		expect(response.result).toBeUndefined()
	})

	it('should include block metadata in response', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000000',
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		const block = response.result?.[0]
		expect(block?.number).toBeDefined()
		expect(isHex(block?.number ?? '')).toBe(true)
		expect(block?.hash).toBeDefined()
		expect(isHex(block?.hash ?? '')).toBe(true)
		expect(block?.timestamp).toBeDefined()
		expect(isHex(block?.timestamp ?? '')).toBe(true)
		expect(block?.gasLimit).toBeDefined()
		expect(isHex(block?.gasLimit ?? '')).toBe(true)
		expect(block?.gasUsed).toBeDefined()
		expect(isHex(block?.gasUsed ?? '')).toBe(true)
	})

	it('should handle blockTag parameter as hex', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000000',
								},
							],
						},
					],
				},
				numberToHex(0n), // blockTag
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should handle blockTag parameter as string', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000000',
								},
							],
						},
					],
				},
				'latest', // blockTag
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should convert all call parameters from hex to bigint', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000001',
									gas: numberToHex(21000n),
									gasPrice: numberToHex(1000000000n),
									maxFeePerGas: numberToHex(2000000000n),
									maxPriorityFeePerGas: numberToHex(1000000000n),
									value: numberToHex(100n),
									nonce: numberToHex(0n),
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should handle stateOverrides with nonce', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
									nonce: numberToHex(5n),
								},
							},
							calls: [
								{
									from: testAddress,
									to: '0x0000000000000000000000000000000000000000',
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should format logs with all required fields', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
								},
							},
							calls: [
								{
									from: testAddress,
									data: encodeDeployData(SimpleContract.deploy(42n)),
								},
							],
						},
					],
				},
			],
		})

		const logs = response.result?.[0]?.calls[0]?.logs
		if (logs && logs.length > 0) {
			const log = logs[0]
			expect(log?.address).toBeDefined()
			expect(log?.topics).toBeDefined()
			expect(log?.data).toBeDefined()
			expect(log?.blockNumber).toBeDefined()
			expect(log?.transactionHash).toBeDefined()
			expect(log?.transactionIndex).toBeDefined()
			expect(log?.blockHash).toBeDefined()
			expect(log?.logIndex).toBeDefined()
			expect(log?.removed).toBeDefined()
			expect(isHex(log?.blockNumber ?? '')).toBe(true)
			expect(isHex(log?.transactionIndex ?? '')).toBe(true)
			expect(isHex(log?.logIndex ?? '')).toBe(true)
		}
	})

	it('should handle contract deployment and call simulation', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
								},
							},
							calls: [
								{
									from: testAddress,
									data: encodeDeployData(SimpleContract.deploy(100n)),
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
		expect(response.result?.[0]?.calls[0]?.returnData).toBeDefined()
		expect(isHex(response.result?.[0]?.calls[0]?.returnData ?? '')).toBe(true)
	})

	it('should handle calls with data parameter', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV1Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const contractAddress = '0x4444444444444444444444444444444444444444' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV1',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(10n ** 18n),
								},
								[contractAddress]: {
									code: SimpleContract.bytecode,
								},
							},
							calls: [
								{
									from: testAddress,
									to: contractAddress,
									data: encodeFunctionData(SimpleContract.read.get()),
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.returnData).toBeDefined()
	})
})
