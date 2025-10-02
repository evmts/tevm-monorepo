import { tevmDefault } from '@tevm/common'
import { tevmActions, tevmSend } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { TransactionFactory } from '@tevm/tx'
import {
	bytesToHex,
	createAddressFromString,
	hexToBytes,
	numberToHex,
	PREFUNDED_ACCOUNTS,
	PREFUNDED_PRIVATE_KEYS,
	parseEther,
} from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { TevmProvider } from './TevmProvider.js'

describe('Ethers Extension JSON-RPC Automining Integration Tests', () => {
	describe('eth_sendRawTransaction should trigger automining when enabled', () => {
		it('should automine transaction when automining is enabled via ethers provider', async () => {
			const provider = await TevmProvider.createMemoryProvider({
				miningConfig: { type: 'auto' },
			})

			// Get initial block number
			const initialBlockNumber = await provider.getBlockNumber()

			// Create and sign transaction
			const tx = TransactionFactory(
				{
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x5208',
					to: createAddressFromString(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			// Send transaction via ethers provider
			const response = await provider.broadcastTransaction(bytesToHex(serializedTx))
			const txHash = response.hash

			expect(txHash).toBe(bytesToHex(signedTx.hash()))

			// Check that transaction was mined (receipt should exist)
			const receipt = await provider.getTransactionReceipt(txHash)

			expect(receipt).toBeTruthy()
			expect(receipt?.hash).toBe(txHash)

			// Check that block number increased (new block was mined)
			const finalBlockNumber = await provider.getBlockNumber()
			expect(finalBlockNumber).toBeGreaterThan(initialBlockNumber)
		})

		it('should not automine when automining is disabled', async () => {
			const node = createTevmNode({ miningConfig: { type: 'manual' } })
			const provider = new TevmProvider(node.extend(tevmActions()).extend(tevmSend()))

			// Get initial block number
			const initialBlockNumber = await provider.getBlockNumber()

			// Create and send transaction
			const tx = TransactionFactory(
				{
					nonce: '0x00',
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x2710',
					to: createAddressFromString(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			const response = await provider.broadcastTransaction(bytesToHex(serializedTx))
			const txHash = response.hash

			// Transaction should be added to txPool but not mined
			const receipt = await provider.getTransactionReceipt(txHash)

			expect(receipt).toBeNull() // No receipt = not mined

			// Block number should remain the same
			const finalBlockNumber = await provider.getBlockNumber()
			expect(finalBlockNumber).toBe(initialBlockNumber)

			// Verify transaction is in txPool via client access
			const txPool = await node.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddressFromString(PREFUNDED_ACCOUNTS[0].address))
			expect(pooledTxs).toHaveLength(1)
			if (!pooledTxs[0]) throw new Error('Transaction not found in pool')
			expect(bytesToHex(pooledTxs[0].tx.hash())).toBe(txHash)
		})
	})

	describe('estimateGas should NOT trigger automining', () => {
		it('should not mine blocks during gas estimation via ethers provider', async () => {
			const node = createTevmNode({ miningConfig: { type: 'auto' }, loggingLevel: 'debug' })
			const provider = new TevmProvider(node.extend(tevmActions()).extend(tevmSend()))

			// Get initial block number
			const initialBlockNumber = await provider.getBlockNumber()

			// Estimate gas for transaction
			const gasEstimate = await provider.estimateGas({
				from: PREFUNDED_ACCOUNTS[0].address,
				to: `0x${'42'.repeat(20)}`,
				value: parseEther('0.1'),
				data: '0x',
			})

			expect(gasEstimate).toBeTruthy()
			expect(gasEstimate.toString()).toMatch(/^\d+$/) // Should be a number

			// Block number should not have changed
			const finalBlockNumber = await provider.getBlockNumber()
			expect(finalBlockNumber).toBe(initialBlockNumber)

			// TxPool should be empty (no transaction created)
			const txPool = await node.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddressFromString(PREFUNDED_ACCOUNTS[0].address))
			expect(pooledTxs).toHaveLength(0)
		})

		it('should not create transactions during multiple gas estimations', async () => {
			const node = createTevmNode({ miningConfig: { type: 'auto' } })
			const provider = new TevmProvider(node.extend(tevmActions()).extend(tevmSend()))

			// Estimate gas multiple times
			for (let i = 0; i < 3; i++) {
				const gasEstimate = await provider.estimateGas({
					from: PREFUNDED_ACCOUNTS[0].address,
					to: `0x${'42'.repeat(20)}`,
					value: parseEther('0.1'),
					data: '0x',
				})

				expect(gasEstimate).toBeTruthy()
			}

			// TxPool should still be empty after multiple estimates
			const txPool = await node.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddressFromString(PREFUNDED_ACCOUNTS[0].address))
			expect(pooledTxs).toHaveLength(0)
		})
	})

	describe('nonce handling should preserve user-provided nonces', () => {
		it('should use user-provided nonce in ethers transactions', async () => {
			const provider = await TevmProvider.createMemoryProvider({
				miningConfig: { type: 'auto' },
			})

			// Send transaction with explicit nonce
			const nextNonce = BigInt(await provider.getTransactionCount(PREFUNDED_ACCOUNTS[0].address))
			const tx = TransactionFactory(
				{
					nonce: numberToHex(nextNonce),
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x5208',
					to: createAddressFromString(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			const response = await provider.broadcastTransaction(bytesToHex(serializedTx))
			const txHash = response.hash

			// Get receipt and verify transaction was processed
			const receipt = await provider.getTransactionReceipt(txHash)

			expect(receipt).toBeTruthy()
			expect(receipt?.hash).toBe(txHash)
			// The raw transaction already contains the nonce, so it should be preserved
			expect(signedTx.nonce).toBe(nextNonce)
		})
	})
})
