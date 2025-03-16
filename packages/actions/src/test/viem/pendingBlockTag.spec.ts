import { createTevmNode } from '@tevm/node'
import { type Address, SimpleContract } from '@tevm/test-utils'
import { bytesToHex, decodeFunctionResult, encodeFunctionData, parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { callHandler } from '../../Call/callHandler.js'
import { mineHandler } from '../../Mine/mineHandler.js'
import { sendTransactionHandler } from '../../SendTransaction/sendTransactionHandler.js'
import { setAccountHandler } from '../../SetAccount/setAccountHandler.js'
import { ethCallProcedure } from '../../eth/ethCallProcedure.js'
import { ethGetBalanceHandler } from '../../eth/ethGetBalanceHandler.js'
import { ethGetBlockByNumberHandler } from '../../eth/ethGetBlockByNumberHandler.js'
import { ethGetCodeHandler } from '../../eth/ethGetCodeHandler.js'
import { ethGetLogsHandler } from '../../eth/ethGetLogsHandler.js'
import { ethGetStorageAtHandler } from '../../eth/ethGetStorageAtHandler.js'

describe('Pending Block Tag Tests', () => {
	const account = `0x${'1'.repeat(40)}` as Address
	const receiver = `0x${'2'.repeat(40)}` as Address
	let client: Awaited<ReturnType<typeof createTevmNode>>
	let contractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		// Fund account
		await setAccountHandler(client)({
			address: account,
			balance: parseEther('10'),
		})

		// Deploy SimpleContract
		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: account,
			data: SimpleContract.bytecode,
			gas: 1000000n,
			value: 0n,
		})

		if (!deployResult?.createResult?.address) {
			throw new Error('Failed to deploy contract')
		}

		contractAddress = deployResult.createResult.address

		// Initialize contract with value 42
		const setCallData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [42n],
		})

		await callHandler(client)({
			createTransaction: true,
			from: account,
			to: contractAddress,
			data: setCallData,
		})

		// Mine the initial transactions
		await mineHandler(client)({})
	})

	describe('eth_call with pending block tag', () => {
		it('should reflect pending state changes in eth_call', async () => {
			// Get initial value
			const getCallData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'get',
			})

			const initialResult = await ethCallProcedure.handler(client)({
				from: account,
				to: contractAddress,
				data: getCallData,
				gas: '0x100000',
				blockParam: 'latest',
			})

			const initialValue = decodeFunctionResult({
				abi: SimpleContract.abi,
				functionName: 'get',
				data: initialResult,
			})

			expect(initialValue).toBe(42n)

			// Send transaction to update value but don't mine
			const setCallData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [999n],
			})

			await sendTransactionHandler(client)({
				from: account,
				to: contractAddress,
				data: setCallData,
			})

			// Get value from latest block - should still be 42
			const latestResult = await ethCallProcedure.handler(client)({
				from: account,
				to: contractAddress,
				data: getCallData,
				gas: '0x100000',
				blockParam: 'latest',
			})

			const latestValue = decodeFunctionResult({
				abi: SimpleContract.abi,
				functionName: 'get',
				data: latestResult,
			})

			expect(latestValue).toBe(42n)

			// Get value from pending block - should be 999
			const pendingResult = await ethCallProcedure.handler(client)({
				from: account,
				to: contractAddress,
				data: getCallData,
				gas: '0x100000',
				blockParam: 'pending',
			})

			const pendingValue = decodeFunctionResult({
				abi: SimpleContract.abi,
				functionName: 'get',
				data: pendingResult,
			})

			expect(pendingValue).toBe(999n)
		})

		it('should handle multiple pending transactions correctly', async () => {
			const getCallData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'get',
			})

			// Send first transaction but don't mine
			const setCallData1 = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [111n],
			})

			await sendTransactionHandler(client)({
				from: account,
				to: contractAddress,
				data: setCallData1,
			})

			// Check pending state after first transaction
			const pendingResult1 = await ethCallProcedure.handler(client)({
				from: account,
				to: contractAddress,
				data: getCallData,
				gas: '0x100000',
				blockParam: 'pending',
			})

			const pendingValue1 = decodeFunctionResult({
				abi: SimpleContract.abi,
				functionName: 'get',
				data: pendingResult1,
			})

			expect(pendingValue1).toBe(111n)

			// Send second transaction but don't mine
			const setCallData2 = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [222n],
			})

			await sendTransactionHandler(client)({
				from: account,
				to: contractAddress,
				data: setCallData2,
			})

			// Check pending state after second transaction
			const pendingResult2 = await ethCallProcedure.handler(client)({
				from: account,
				to: contractAddress,
				data: getCallData,
				gas: '0x100000',
				blockParam: 'pending',
			})

			const pendingValue2 = decodeFunctionResult({
				abi: SimpleContract.abi,
				functionName: 'get',
				data: pendingResult2,
			})

			expect(pendingValue2).toBe(222n)

			// Latest block should still have the old value
			const latestResult = await ethCallProcedure.handler(client)({
				from: account,
				to: contractAddress,
				data: getCallData,
				gas: '0x100000',
				blockParam: 'latest',
			})

			const latestValue = decodeFunctionResult({
				abi: SimpleContract.abi,
				functionName: 'get',
				data: latestResult,
			})

			expect(latestValue).toBe(42n)

			// Mine the transactions
			await mineHandler(client)({})

			// Now latest should have the new value
			const finalResult = await ethCallProcedure.handler(client)({
				from: account,
				to: contractAddress,
				data: getCallData,
				gas: '0x100000',
				blockParam: 'latest',
			})

			const finalValue = decodeFunctionResult({
				abi: SimpleContract.abi,
				functionName: 'get',
				data: finalResult,
			})

			expect(finalValue).toBe(222n)
		})
	})

	describe('eth_getStorageAt with pending block tag', () => {
		it('should reflect pending storage changes', async () => {
			// Get initial storage at slot 0 (where the SimpleContract value is stored)
			const storageSlot = '0x0000000000000000000000000000000000000000000000000000000000000000'

			const initialStorage = await ethGetStorageAtHandler(client)({
				address: contractAddress,
				position: storageSlot,
				blockParam: 'latest',
			})

			// Storage value should be 42 (0x2a)
			expect(initialStorage).toContain('2a')

			// Send transaction to update value but don't mine
			const setCallData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [888n],
			})

			await sendTransactionHandler(client)({
				from: account,
				to: contractAddress,
				data: setCallData,
			})

			// Get storage at latest block - should still be 42
			const latestStorage = await ethGetStorageAtHandler(client)({
				address: contractAddress,
				position: storageSlot,
				blockParam: 'latest',
			})

			expect(latestStorage).toContain('2a')

			// Get storage at pending block - should be 888 (0x378)
			const pendingStorage = await ethGetStorageAtHandler(client)({
				address: contractAddress,
				position: storageSlot,
				blockParam: 'pending',
			})

			expect(pendingStorage).toContain('378')
		})
	})

	describe('eth_getCode with pending block tag', () => {
		it('should show code for newly deployed contracts in pending but not in latest', async () => {
			// Deploy a new contract but don't mine
			const deployResult = await callHandler(client)({
				createTransaction: true,
				from: account,
				data: SimpleContract.bytecode,
				gas: 1000000n,
			})

			if (!deployResult?.createResult?.address) {
				throw new Error('Failed to deploy contract')
			}

			const newContractAddress = deployResult.createResult.address

			// Get code at latest block - should be empty
			const latestCode = await ethGetCodeHandler(client)({
				address: newContractAddress,
				blockParam: 'latest',
			})

			expect(latestCode).toBe('0x')

			// Get code at pending block - should have the contract bytecode
			const pendingCode = await ethGetCodeHandler(client)({
				address: newContractAddress,
				blockParam: 'pending',
			})

			expect(pendingCode).not.toBe('0x')
			expect(pendingCode.length).toBeGreaterThan(2)

			// Mine the transaction
			await mineHandler(client)({})

			// Now latest should have the code
			const finalCode = await ethGetCodeHandler(client)({
				address: newContractAddress,
				blockParam: 'latest',
			})

			expect(finalCode).toBe(pendingCode)
		})
	})

	describe('eth_getBlockByNumber with pending block tag', () => {
		it('should return the pending block with pending transactions', async () => {
			// Send a transaction but don't mine
			const setCallData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [123n],
			})

			const txResult = await sendTransactionHandler(client)({
				from: account,
				to: contractAddress,
				data: setCallData,
			})

			// Get pending block with transactions
			const pendingBlock = await ethGetBlockByNumberHandler(client)({
				blockParam: 'pending',
				fullTransactionObjects: true,
			})

			// Should have our transaction
			expect(pendingBlock?.transactions).toBeDefined()

			// Transactions should be an array of objects
			expect(Array.isArray(pendingBlock?.transactions)).toBe(true)
			expect(pendingBlock?.transactions.length).toBeGreaterThan(0)

			// Find our transaction in the block
			const pendingTx = pendingBlock?.transactions.find((tx) => tx.hash === txResult)

			expect(pendingTx).toBeDefined()

			// Get latest block
			const latestBlock = await ethGetBlockByNumberHandler(client)({
				blockParam: 'latest',
				fullTransactionObjects: true,
			})

			// Latest block shouldn't have our transaction
			const latestTx = latestBlock?.transactions.find((tx) => tx.hash === txResult)
			expect(latestTx).toBeUndefined()

			// Pending block's parent hash should match latest block's hash
			expect(pendingBlock?.parentHash).toBe(latestBlock?.hash)
		})
	})

	describe('eth_getBalance with pending block tag', () => {
		it('should reflect pending balance changes', async () => {
			// Get initial balances
			const initialSenderBalance = await ethGetBalanceHandler(client)({
				address: account,
				blockParam: 'latest',
			})

			const initialReceiverBalance = await ethGetBalanceHandler(client)({
				address: receiver,
				blockParam: 'latest',
			})

			// Send transaction to transfer 1 ETH but don't mine
			await sendTransactionHandler(client)({
				from: account,
				to: receiver,
				value: parseEther('1'),
			})

			// Get balances at latest block - should be unchanged
			const latestSenderBalance = await ethGetBalanceHandler(client)({
				address: account,
				blockParam: 'latest',
			})

			const latestReceiverBalance = await ethGetBalanceHandler(client)({
				address: receiver,
				blockParam: 'latest',
			})

			expect(latestSenderBalance).toBe(initialSenderBalance)
			expect(latestReceiverBalance).toBe(initialReceiverBalance)

			// Get balances at pending block - should reflect transfer
			const pendingSenderBalance = await ethGetBalanceHandler(client)({
				address: account,
				blockParam: 'pending',
			})

			const pendingReceiverBalance = await ethGetBalanceHandler(client)({
				address: receiver,
				blockParam: 'pending',
			})

			// Sender balance should be decreased (accounting for gas used)
			expect(BigInt(pendingSenderBalance)).toBeLessThan(BigInt(initialSenderBalance))
			// Receiver balance should be increased by exactly 1 ETH
			expect(BigInt(pendingReceiverBalance)).toBe(BigInt(initialReceiverBalance) + parseEther('1'))
		})
	})

	describe('eth_getLogs with pending block tag', () => {
		it('should return logs from pending transactions', async () => {
			// Find the ValueChanged event in the ABI
			const valueChangedEvent = SimpleContract.abi.find(
				(entry) => entry.type === 'event' && entry.name === 'ValueChanged',
			)

			if (!valueChangedEvent) {
				throw new Error('ValueChanged event not found in ABI')
			}

			// Send a transaction that emits an event
			const setCallData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [456n],
			})

			await sendTransactionHandler(client)({
				from: account,
				to: contractAddress,
				data: setCallData,
			})

			// Get logs from latest block
			const latestLogs = await ethGetLogsHandler(client)({
				fromBlock: 'latest',
				toBlock: 'latest',
				address: contractAddress,
			})

			// Latest logs should be empty since we haven't mined yet
			expect(latestLogs.length).toBe(0)

			// Get logs from pending block
			const pendingLogs = await ethGetLogsHandler(client)({
				fromBlock: 'pending',
				toBlock: 'pending',
				address: contractAddress,
			})

			// Pending logs should include our event
			expect(pendingLogs.length).toBeGreaterThan(0)
			expect(pendingLogs[0].address.toLowerCase()).toBe(contractAddress.toLowerCase())

			// Mine the transaction
			await mineHandler(client)({})

			// Now latest logs should include our event
			const newLatestLogs = await ethGetLogsHandler(client)({
				fromBlock: 'latest',
				toBlock: 'latest',
				address: contractAddress,
			})

			expect(newLatestLogs.length).toBeGreaterThan(0)
			expect(newLatestLogs[0].address.toLowerCase()).toBe(contractAddress.toLowerCase())
		})
	})
})
