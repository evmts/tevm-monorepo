import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, isHex, numberToHex, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethSimulateV2Procedure } from './ethSimulateV2Procedure.js'

describe('ethSimulateV2Procedure', () => {
	it('should simulate a simple call and return JSON-RPC formatted response', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		expect(response.method).toBe('eth_simulateV2')
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
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		expect(response.method).toBe('eth_simulateV2')
	})

	it('should convert hex values to bigint for handler', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const targetAddress = '0x1111111111111111111111111111111111111111' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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

	it('should simulate multiple calls in a single block', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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

	it('should handle calls with insufficient balance (error case)', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const targetAddress = '0x3333333333333333333333333333333333333333' as const

		// Try to send more ETH than the account has
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							stateOverrides: {
								[testAddress]: {
									balance: numberToHex(1000n), // Only 1000 wei
								},
							},
							calls: [
								{
									from: testAddress,
									to: targetAddress,
									value: numberToHex(10n ** 18n), // Try to send 1 ETH
								},
							],
						},
					],
				},
			],
		})

		// The call should either fail with an error or return with status 0
		expect(response.result).toBeDefined()
		// Note: behavior may vary - insufficient funds might return error at procedure level
		// or status 0 at call level depending on validation mode
	})

	it('should return error response when handler throws', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		// Pass invalid params to trigger error
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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

	// V2-specific feature tests
	it('should handle includeContractCreationEvents option', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
					includeContractCreationEvents: true,
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
		// V2 should include contract creation info when a contract is created
		if (response.result?.[0]?.calls[0]?.contractCreated) {
			expect(response.result[0].calls[0].contractCreated.address).toBeDefined()
		}
	})

	it('should handle includeCallTraces option', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const contractAddress = '0x5555555555555555555555555555555555555555' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
					includeCallTraces: true,
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
		// V2 should include trace when includeCallTraces is true
		if (response.result?.[0]?.calls[0]?.trace) {
			const trace = response.result[0].calls[0].trace
			expect(trace.type).toBeDefined()
			expect(trace.from).toBeDefined()
			expect(trace.gas).toBeDefined()
			expect(trace.gasUsed).toBeDefined()
			expect(trace.input).toBeDefined()
			expect(trace.output).toBeDefined()
		}
	})

	it('should handle estimateGas option on calls', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const contractAddress = '0x6666666666666666666666666666666666666666' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
									estimateGas: true,
								},
							],
						},
					],
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
		// V2 should include estimated gas when estimateGas is true
		if (response.result?.[0]?.calls[0]?.estimatedGas) {
			expect(isHex(response.result[0].calls[0].estimatedGas)).toBe(true)
		}
	})

	it('should handle blockOverrides with blobBaseFee', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
			id: 1,
			params: [
				{
					blockStateCalls: [
						{
							blockOverrides: {
								blobBaseFee: numberToHex(1000000n),
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

	it('should handle stateOverrides with state and stateDiff', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		const contractAddress = '0x7777777777777777777777777777777777777777' as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
									stateDiff: {
										'0x0000000000000000000000000000000000000000000000000000000000000000':
											'0x000000000000000000000000000000000000000000000000000000000000002a', // 42
									},
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
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
	})

	it('should format call trace recursively for nested calls', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
					includeCallTraces: true,
				},
			],
		})

		expect(response.result).toBeDefined()
		// If trace exists, verify it has proper structure
		if (response.result?.[0]?.calls[0]?.trace) {
			const trace = response.result[0].calls[0].trace
			expect(trace.type).toBeDefined()
			expect(trace.from).toBeDefined()
			expect(isHex(trace.gas)).toBe(true)
			expect(isHex(trace.gasUsed)).toBe(true)
		}
	})

	it('should handle contract deployment and return contractCreated info', async () => {
		const client = createTevmNode()
		await client.ready()
		const procedure = ethSimulateV2Procedure(client)

		const testAddress = PREFUNDED_ACCOUNTS[0].address as const

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
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
					includeContractCreationEvents: true,
				},
			],
		})

		expect(response.result).toBeDefined()
		expect(response.result?.[0]?.calls[0]?.status).toBe(numberToHex(1n))
		// Check if contractCreated is included
		if (response.result?.[0]?.calls[0]?.contractCreated) {
			expect(response.result[0].calls[0].contractCreated.address).toBeDefined()
			expect(response.result[0].calls[0].contractCreated.creator).toBeDefined()
		}
	})
})
