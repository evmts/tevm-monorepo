import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethSimulateV2Handler } from './ethSimulateV2Handler.js'

describe('ethSimulateV2Handler', () => {
	it('should simulate a simple call', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		// Set up a test account with balance
		const testAddress = '0x1234567890123456789012345678901234567890' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const result = await handler({
			blockStateCalls: [
				{
					calls: [
						{
							from: testAddress,
							to: '0x0000000000000000000000000000000000000000',
							value: 0n,
						},
					],
				},
			],
		})

		expect(result).toBeDefined()
		expect(result.length).toBe(1)
		expect(result[0]).toBeDefined()
		expect(result[0]!.calls.length).toBe(1)
		expect(result[0]!.calls[0]!.status).toBe(1n)
	})

	it('should handle empty blockStateCalls', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		await expect(
			handler({
				blockStateCalls: [],
			}),
		).rejects.toThrow('blockStateCalls is required and must not be empty')
	})

	it('should simulate multiple calls in a single block', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const result = await handler({
			blockStateCalls: [
				{
					calls: [
						{
							from: testAddress,
							to: '0x0000000000000000000000000000000000000001',
							value: 0n,
						},
						{
							from: testAddress,
							to: '0x0000000000000000000000000000000000000002',
							value: 0n,
						},
					],
				},
			],
		})

		expect(result.length).toBe(1)
		expect(result[0]!.calls.length).toBe(2)
	})

	it('should simulate multiple blocks', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const result = await handler({
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
		})

		expect(result.length).toBe(2)
		expect(result[0]!.calls.length).toBe(1)
		expect(result[1]!.calls.length).toBe(1)
		// Second block should have higher number
		expect(result[1]!.number).toBeGreaterThan(result[0]!.number)
	})

	it('should apply state overrides', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		const contractAddress = '0xabcdef0123456789012345678901234567890123' as const

		// Simple storage contract bytecode that returns the value at storage slot 0
		const bytecode = '0x6080604052348015600f57600080fd5b506000548060005260206000f3' as const

		const result = await handler({
			blockStateCalls: [
				{
					stateOverrides: {
						[testAddress]: {
							balance: 10n ** 18n,
						},
						[contractAddress]: {
							code: bytecode,
							state: {
								'0x0000000000000000000000000000000000000000000000000000000000000000':
									'0x000000000000000000000000000000000000000000000000000000000000002a', // 42
							},
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
		})

		expect(result.length).toBe(1)
		expect(result[0]!.calls.length).toBe(1)
		expect(result[0]!.calls[0]!.status).toBe(1n)
	})

	it('should handle failed calls', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		// Create a contract that always reverts
		const revertingBytecode = '0x60006000fd' as const // PUSH1 0x00 PUSH1 0x00 REVERT
		const contractAddress = '0xabcdef0123456789012345678901234567890123' as const
		const testAddress = '0x1234567890123456789012345678901234567890' as const

		const result = await handler({
			blockStateCalls: [
				{
					stateOverrides: {
						[testAddress]: {
							balance: 10n ** 18n,
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
		})

		expect(result.length).toBe(1)
		expect(result[0]!.calls.length).toBe(1)
		expect(result[0]!.calls[0]!.status).toBe(0n)
		expect(result[0]!.calls[0]!.error).toBeDefined()
	})

	it('should return block information', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const result = await handler({
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
		})

		expect(result[0]!.number).toBeDefined()
		expect(result[0]!.hash).toBeDefined()
		expect(result[0]!.timestamp).toBeDefined()
		expect(result[0]!.gasLimit).toBeDefined()
		expect(result[0]!.gasUsed).toBeDefined()
	})

	// V2 specific tests

	it('should include call traces when includeCallTraces is true', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const result = await handler({
			blockStateCalls: [
				{
					calls: [
						{
							from: testAddress,
							to: '0x0000000000000000000000000000000000000000',
							value: 1000n,
							data: '0x1234',
						},
					],
				},
			],
			includeCallTraces: true,
		})

		expect(result.length).toBe(1)
		expect(result[0]!.calls.length).toBe(1)
		const callResult = result[0]!.calls[0]!
		expect(callResult.trace).toBeDefined()
		expect(callResult.trace!.type).toBe('CALL')
		expect(callResult.trace!.from).toBe(testAddress)
		expect(callResult.trace!.to).toBe('0x0000000000000000000000000000000000000000')
		expect(callResult.trace!.value).toBe(1000n)
		expect(callResult.trace!.input).toBe('0x1234')
		expect(callResult.trace!.gasUsed).toBeDefined()
		expect(callResult.trace!.output).toBeDefined()
	})

	it('should not include call traces when includeCallTraces is false', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const result = await handler({
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
			includeCallTraces: false,
		})

		expect(result[0]!.calls[0]!.trace).toBeUndefined()
	})

	it('should include gas estimation when estimateGas is true', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		const contractAddress = '0xabcdef0123456789012345678901234567890123' as const
		// Simple contract that stores a value (uses gas for SSTORE)
		const bytecode = '0x602a60005560206000f3' as const

		const result = await handler({
			blockStateCalls: [
				{
					stateOverrides: {
						[testAddress]: {
							balance: 10n ** 18n,
						},
						[contractAddress]: {
							code: bytecode,
						},
					},
					calls: [
						{
							from: testAddress,
							to: contractAddress,
							estimateGas: true,
						},
					],
				},
			],
		})

		expect(result[0]!.calls[0]!.estimatedGas).toBeDefined()
		// The estimated gas should equal the gas used
		expect(result[0]!.calls[0]!.estimatedGas).toBe(result[0]!.calls[0]!.gasUsed)
	})

	it('should detect contract creation with includeContractCreationEvents', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		// Simple contract that just stores 42 and returns it
		// PUSH1 0x2a PUSH1 0x00 SSTORE PUSH1 0x2a PUSH1 0x00 MSTORE PUSH1 0x20 PUSH1 0x00 RETURN
		const initCode = '0x602a60005560206000f3' as const

		const result = await handler({
			blockStateCalls: [
				{
					calls: [
						{
							from: testAddress,
							// No 'to' = contract creation
							data: initCode,
							value: 0n,
						},
					],
				},
			],
			includeContractCreationEvents: true,
		})

		expect(result.length).toBe(1)
		expect(result[0]!.calls.length).toBe(1)

		const callResult = result[0]!.calls[0]!
		// Contract creation should be detected
		if (callResult.contractCreated) {
			expect(callResult.contractCreated.address).toBeDefined()
			expect(callResult.contractCreated.creator).toBe(testAddress)
			expect(callResult.contractCreated.code).toBeDefined()

			// Should have synthetic log for contract creation
			const creationLog = callResult.logs.find((log) => log.address === '0xcccccccccccccccccccccccccccccccccccccccc')
			expect(creationLog).toBeDefined()
		}
	})

	it('should include fee recipient in block result when specified', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		const coinbase = '0xfeefeefeefeefeefeefeefeefeefeefeefeefee0' as const
		await setAccountHandler(client)({
			address: testAddress,
			balance: 10n ** 18n,
		})

		const result = await handler({
			blockStateCalls: [
				{
					blockOverrides: {
						coinbase,
					},
					calls: [
						{
							from: testAddress,
							to: '0x0000000000000000000000000000000000000000',
						},
					],
				},
			],
		})

		expect(result[0]!.feeRecipient).toBe(coinbase)
	})

	it('should include error in trace when call fails', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV2Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		const contractAddress = '0xabcdef0123456789012345678901234567890123' as const
		const revertingBytecode = '0x60006000fd' as const // REVERT

		const result = await handler({
			blockStateCalls: [
				{
					stateOverrides: {
						[testAddress]: {
							balance: 10n ** 18n,
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
			includeCallTraces: true,
		})

		expect(result[0]!.calls[0]!.trace).toBeDefined()
		expect(result[0]!.calls[0]!.trace!.error).toBeDefined()
	})
})
