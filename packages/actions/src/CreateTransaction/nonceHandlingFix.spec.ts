import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { hexToBytes } from '@tevm/utils'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTransaction } from './createTransaction.js'

describe('createTransaction - nonce handling fix', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(async () => {
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})
	})

	it('should preserve user-provided nonce instead of overwriting it', async () => {
		const privateKey = generatePrivateKey()
		const account = privateKeyToAccount(privateKey)

		// Set up account with nonce 5
		const vm = await client.getVm()
		await vm.stateManager.putAccount(
			hexToBytes(account.address),
			{
				balance: BigInt('1000000000000000000'), // 1 ETH
				nonce: 5n, // Account nonce is 5
			} as any,
		)

		const txCreator = createTransaction(client)

		// Create transaction with user-specified nonce 10 (higher than account nonce)
		const userSpecifiedNonce = 10n
		
		// Mock evmInput and evmOutput for transaction creation
		const mockEvmOutput = {
			totalGasSpent: 21000n,
			amountSpent: 420n,
			gas: 21000n,
			execResult: {
				gasUsed: 21000n,
				gasRefund: 0n,
			},
		} as any

		const mockEvmInput = {
			gasLimit: 21000n,
			gasPrice: 1000000000n, // 1 gwei
			to: hexToBytes(`0x${'69'.repeat(20)}`),
			value: 420n,
			caller: hexToBytes(account.address),
			origin: hexToBytes(account.address),
		}

		const result = await txCreator({
			throwOnFail: false,
			evmOutput: mockEvmOutput,
			evmInput: mockEvmInput,
			// User explicitly provides nonce
			nonce: userSpecifiedNonce,
		})

		expect('txHash' in result).toBe(true)
		if ('txHash' in result) {
			const txPool = await client.getTxPool()
			const txs = await txPool.getBySenderAddress([hexToBytes(account.address)])
			
			// Should find exactly one transaction
			expect(txs).toHaveLength(1)
			
			// CRITICAL: Transaction should have the user-specified nonce, not auto-calculated one
			// This test will fail initially because current implementation always overwrites nonces
			expect(txs[0].tx.nonce).toBe(userSpecifiedNonce)
		}
	})

	it('should use auto-calculated nonce when user does not provide one', async () => {
		const privateKey = generatePrivateKey()
		const account = privateKeyToAccount(privateKey)

		// Set up account with nonce 3
		const vm = await client.getVm()
		await vm.stateManager.putAccount(
			hexToBytes(account.address),
			{
				balance: BigInt('1000000000000000000'),
				nonce: 3n, // Account nonce is 3
			} as any,
		)

		const txCreator = createTransaction(client)

		const mockEvmOutput = {
			totalGasSpent: 21000n,
			amountSpent: 420n,
			gas: 21000n,
			execResult: {
				gasUsed: 21000n,
				gasRefund: 0n,
			},
		} as any

		const mockEvmInput = {
			gasLimit: 21000n,
			gasPrice: 1000000000n,
			to: hexToBytes(`0x${'69'.repeat(20)}`),
			value: 420n,
			caller: hexToBytes(account.address),
			origin: hexToBytes(account.address),
		}

		const result = await txCreator({
			throwOnFail: false,
			evmOutput: mockEvmOutput,
			evmInput: mockEvmInput,
			// No nonce provided - should use auto-calculated
		})

		expect('txHash' in result).toBe(true)
		if ('txHash' in result) {
			const txPool = await client.getTxPool()
			const txs = await txPool.getBySenderAddress([hexToBytes(account.address)])
			
			expect(txs).toHaveLength(1)
			
			// Should use next valid nonce (account nonce = 3, so next should be 3)
			expect(txs[0].tx.nonce).toBe(3n)
		}
	})

	it('should handle sequential user-provided nonces correctly', async () => {
		const privateKey = generatePrivateKey()
		const account = privateKeyToAccount(privateKey)

		// Set up account with nonce 0
		const vm = await client.getVm()
		await vm.stateManager.putAccount(
			hexToBytes(account.address),
			{
				balance: BigInt('10000000000000000000'), // 10 ETH
				nonce: 0n,
			} as any,
		)

		const txCreator = createTransaction(client)

		const createMockData = (nonce: bigint) => ({
			mockEvmOutput: {
				totalGasSpent: 21000n,
				amountSpent: 420n,
				gas: 21000n,
				execResult: { gasUsed: 21000n, gasRefund: 0n },
			} as any,
			mockEvmInput: {
				gasLimit: 21000n,
				gasPrice: 1000000000n,
				to: hexToBytes(`0x${'69'.repeat(20)}`),
				value: 420n,
				caller: hexToBytes(account.address),
				origin: hexToBytes(account.address),
			},
		})

		// Create first transaction with nonce 0
		const { mockEvmOutput: output1, mockEvmInput: input1 } = createMockData(0n)
		const result1 = await txCreator({
			throwOnFail: false,
			evmOutput: output1,
			evmInput: input1,
			nonce: 0n,
		})

		// Create second transaction with nonce 1
		const { mockEvmOutput: output2, mockEvmInput: input2 } = createMockData(1n)
		const result2 = await txCreator({
			throwOnFail: false,
			evmOutput: output2,
			evmInput: input2,
			nonce: 1n,
		})

		expect('txHash' in result1).toBe(true)
		expect('txHash' in result2).toBe(true)

		if ('txHash' in result1 && 'txHash' in result2) {
			const txPool = await client.getTxPool()
			const txs = await txPool.getBySenderAddress([hexToBytes(account.address)])
			
			// Should have 2 transactions
			expect(txs).toHaveLength(2)
			
			// Transactions should maintain their user-specified nonces
			const nonces = txs.map(tx => tx.tx.nonce).sort()
			expect(nonces).toEqual([0n, 1n])
		}
	})
})