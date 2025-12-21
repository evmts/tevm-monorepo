import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { ethSimulateV1Handler } from './ethSimulateV1Handler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { encodeDeployData, encodeFunctionData, parseAbi } from '@tevm/utils'

describe('ethSimulateV1Handler', () => {
	it('should simulate a simple call', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV1Handler(client)

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
		const handler = ethSimulateV1Handler(client)

		await expect(
			handler({
				blockStateCalls: [],
			}),
		).rejects.toThrow('blockStateCalls is required and must not be empty')
	})

	it('should simulate multiple calls in a single block', async () => {
		const client = createTevmNode()
		await client.ready()
		const handler = ethSimulateV1Handler(client)

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
		const handler = ethSimulateV1Handler(client)

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
		const handler = ethSimulateV1Handler(client)

		const testAddress = '0x1234567890123456789012345678901234567890' as const
		const contractAddress = '0xabcdef0123456789012345678901234567890123' as const

		// Simple storage contract bytecode that returns the value at storage slot 0
		const bytecode =
			'0x6080604052348015600f57600080fd5b506000548060005260206000f3' as const

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
		const handler = ethSimulateV1Handler(client)

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
		const handler = ethSimulateV1Handler(client)

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
})
