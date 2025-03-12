import { SimpleContract } from '@tevm/contract'
import { type Client, createClient, decodeFunctionResult, encodeFunctionData } from 'viem'
import { parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmCall } from './tevmCall.js'
import { tevmDeploy } from './tevmDeploy.js'
import { tevmDumpState } from './tevmDumpState.js'
import { tevmLoadState } from './tevmLoadState.js'
import { tevmMine } from './tevmMine.js'
import { tevmSetAccount } from './tevmSetAccount.js'

describe('Tevm State Management', () => {
	let client: Client<TevmTransport>
	const testAddress = '0x1234567890123456789012345678901234567890'
	let contractAddress: string

	beforeEach(async () => {
		client = createClient({
			transport: createTevmTransport(),
		})
	})

	it('should support state snapshot and restore functionality', async () => {
		// 1. Setup initial state
		// Set account balance
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('10'),
			nonce: 1n,
		})

		// Deploy contract with initial value
		const initialValue = 42n
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [initialValue],
		})

		expect(deployResult.createdAddress).toBeDefined()
		contractAddress = deployResult.createdAddress

		// Mine a block to include the deployment
		await tevmMine(client, { blockCount: 1 })

		// 2. Verify initial state
		const getDataEncoded = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		const initialCallResult = await tevmCall(client, {
			to: contractAddress,
			data: getDataEncoded,
		})

		const decodedInitialValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: initialCallResult.rawData,
		})

		expect(decodedInitialValue).toBe(initialValue)

		// 3. Take a snapshot of the current state
		const stateDump = await tevmDumpState(client)

		// 4. Make changes that will be reverted
		const tempValue = 999n
		const setDataEncoded = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [tempValue],
		})

		await tevmCall(client, {
			to: contractAddress,
			data: setDataEncoded,
			createTransaction: true,
		})

		await tevmMine(client, { blockCount: 1 })

		// Verify the change was made
		const tempCallResult = await tevmCall(client, {
			to: contractAddress,
			data: getDataEncoded,
		})

		const decodedTempValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: tempCallResult.rawData,
		})

		expect(decodedTempValue).toBe(tempValue)

		// 5. Restore to the previous state
		await tevmLoadState(client, stateDump)

		// 6. Verify the state was reverted
		const finalCallResult = await tevmCall(client, {
			to: contractAddress,
			data: getDataEncoded,
		})

		const decodedFinalValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: finalCallResult.rawData,
		})

		// Should be back to the initial value
		expect(decodedFinalValue).toBe(initialValue)
	})

	it('should support incremental snapshots during execution', async () => {
		// 1. Setup initial state
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('5'),
			nonce: 1n,
		})

		// Deploy contract with initial value
		const initialValue = 100n
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [initialValue],
		})

		expect(deployResult.createdAddress).toBeDefined()
		contractAddress = deployResult.createdAddress

		// Mine a block to include the deployment
		await tevmMine(client, { blockCount: 1 })

		// 2. Take initial snapshot
		const initialSnapshot = await tevmDumpState(client)

		// 3. Make first change
		const middleValue = 200n
		const setDataEncoded = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [middleValue],
		})

		await tevmCall(client, {
			to: contractAddress,
			data: setDataEncoded,
			createTransaction: true,
		})

		await tevmMine(client, { blockCount: 1 })

		// 4. Take intermediate snapshot
		const intermediateSnapshot = await tevmDumpState(client)

		// 5. Make another change
		const finalValue = 300n
		const finalSetDataEncoded = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [finalValue],
		})

		await tevmCall(client, {
			to: contractAddress,
			data: finalSetDataEncoded,
			createTransaction: true,
		})

		await tevmMine(client, { blockCount: 1 })

		// 6. Verify the latest change
		const getDataEncoded = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		const latestCallResult = await tevmCall(client, {
			to: contractAddress,
			data: getDataEncoded,
		})

		const decodedLatestValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: latestCallResult.rawData,
		})

		expect(decodedLatestValue).toBe(finalValue)

		// 7. Restore to the intermediate snapshot
		await tevmLoadState(client, intermediateSnapshot)

		// 8. Verify we're back to the middle value
		const midCallResult = await tevmCall(client, {
			to: contractAddress,
			data: getDataEncoded,
		})

		const decodedMidValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: midCallResult.rawData,
		})

		expect(decodedMidValue).toBe(middleValue)

		// 9. Restore to the initial snapshot
		await tevmLoadState(client, initialSnapshot)

		// 10. Verify we're back to the initial value
		const initialCallResult = await tevmCall(client, {
			to: contractAddress,
			data: getDataEncoded,
		})

		const decodedInitialValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: initialCallResult.rawData,
		})

		expect(decodedInitialValue).toBe(initialValue)
	})
})
