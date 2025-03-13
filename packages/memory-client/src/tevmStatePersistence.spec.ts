import { SimpleContract } from '@tevm/contract'
import { type Client, createClient, decodeFunctionResult, encodeFunctionData } from 'viem'
import { parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmCall } from './tevmCall.js'
import { tevmDeploy } from './tevmDeploy.js'
import { tevmDumpState } from './tevmDumpState.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { tevmLoadState } from './tevmLoadState.js'
import { tevmMine } from './tevmMine.js'
import { tevmSetAccount } from './tevmSetAccount.js'

describe('Tevm State Persistence', () => {
	let sourceClient: Client<TevmTransport>
	let targetClient: Client<TevmTransport>
	const testAddress = '0x1234567890123456789012345678901234567890'
	let contractAddress: `0x${string}`

	beforeEach(async () => {
		// Create two separate clients
		sourceClient = createClient({
			transport: createTevmTransport(),
		})

		targetClient = createClient({
			transport: createTevmTransport(),
		})
	})

	it('should dump and load state with contract interaction across clients', async () => {
		// 1. Setup initial state on sourceClient
		// Set account balance
		await tevmSetAccount(sourceClient, {
			address: testAddress,
			balance: parseEther('10'),
			nonce: 1n,
		})

		// Deploy contract with initial value
		const initialValue = 42n
		const deployResult = await tevmDeploy(sourceClient, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [initialValue],
		})

		expect(deployResult.createdAddress).toBeDefined()
		contractAddress = deployResult.createdAddress as `0x${string}`

		// Mine a block to include the deployment
		await tevmMine(sourceClient, { blockCount: 1 })

		// 2. Verify initial state
		// Verify contract was deployed correctly
		const getDataEncoded = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		const initialCallResult = await tevmCall(sourceClient, {
			to: contractAddress as `0x${string}`,
			data: getDataEncoded,
		})

		// Decode the result
		const decodedInitialValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: initialCallResult.rawData,
		})

		expect(decodedInitialValue).toBe(initialValue)

		// 3. Dump the entire state from sourceClient
		const dumpedState = await tevmDumpState(sourceClient)

		// Verify dumped state has essential properties
		expect(dumpedState).toHaveProperty('state')
		// The state should have data structure from ethereumjs, which includes accounts
		// but we don't want to be too strict about the exact structure

		// 4. Load state into the targetClient
		await tevmLoadState(targetClient, dumpedState)

		// 5. Verify state was transferred correctly
		// Check account balance
		const accountInfo = await tevmGetAccount(targetClient, {
			address: testAddress,
		})
		expect(accountInfo.balance).toBe(parseEther('10'))
		expect(accountInfo.nonce).toBe(1n)

		// Verify contract code and state were transferred
		const targetCallResult = await tevmCall(targetClient, {
			to: contractAddress as `0x${string}`,
			data: getDataEncoded,
		})

		const decodedTargetValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: targetCallResult.rawData,
		})

		expect(decodedTargetValue).toBe(initialValue)

		// 6. Modify contract state in targetClient
		const newValue = 99n
		const setDataEncoded = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [newValue],
		})

		await tevmCall(targetClient, {
			to: contractAddress as `0x${string}`,
			data: setDataEncoded,
			createTransaction: true,
		})

		await tevmMine(targetClient, { blockCount: 1 })

		// 7. Verify modified state
		const updatedCallResult = await tevmCall(targetClient, {
			to: contractAddress as `0x${string}`,
			data: getDataEncoded,
		})

		const decodedUpdatedValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: updatedCallResult.rawData,
		})

		expect(decodedUpdatedValue).toBe(newValue)

		// 8. Confirm sourceClient state remains unaffected
		const originalCallResult = await tevmCall(sourceClient, {
			to: contractAddress as `0x${string}`,
			data: getDataEncoded,
		})

		const decodedOriginalValue = decodeFunctionResult({
			abi: SimpleContract.abi,
			functionName: 'get',
			data: originalCallResult.rawData,
		})

		// Source client should still have the initial value
		expect(decodedOriginalValue).toBe(initialValue)
	})
})
