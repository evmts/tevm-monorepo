import { createAddress } from '@tevm/address'
import { tevmDefault } from '@tevm/common'
import { TransactionFactory } from '@tevm/tx'
import { bytesToHex, hexToBytes, PREFUNDED_PRIVATE_KEYS, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'

describe('Memory Client JSON-RPC Automining Integration Tests', () => {
	describe('eth_sendRawTransaction should trigger automining when enabled', () => {
		it('should automine transaction when automining is enabled via viem client', async () => {
			const client = createMemoryClient({
				miningConfig: { type: 'auto' },
				loggingLevel: 'debug',
			})

			const initialBlockNumber = await client.getBlockNumber()

			const tx = TransactionFactory(
				{
					nonce: '0x00',
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x2710',
					to: createAddress(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			// Send transaction via JSON-RPC
			const txHash = await client.request({
				method: 'eth_sendRawTransaction',
				params: [bytesToHex(serializedTx)],
			})

			expect(txHash).toBe(bytesToHex(signedTx.hash()))

			const receipt = await client.request({
				method: 'eth_getTransactionReceipt',
				params: [txHash],
			})

			expect(receipt).toBeTruthy()
			expect(receipt).toHaveProperty('transactionHash', txHash)

			const finalBlockNumber = await client.getBlockNumber()
			expect(finalBlockNumber).toBeGreaterThan(initialBlockNumber)
		})

		it('should not automine when automining is disabled', async () => {
			const client = createMemoryClient({
				miningConfig: { type: 'manual' },
				loggingLevel: 'debug',
			})

			const initialBlockNumber = await client.getBlockNumber()

			const tx = TransactionFactory(
				{
					nonce: '0x00',
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x2710',
					to: createAddress(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			const txHash = await client.request({
				method: 'eth_sendRawTransaction',
				params: [bytesToHex(serializedTx)],
			})

			const receipt = await client.request({
				method: 'eth_getTransactionReceipt',
				params: [txHash],
			})

			expect(receipt).toBeNull() // No receipt = not mined

			// Block number should remain the same
			const finalBlockNumber = await client.getBlockNumber()
			expect(finalBlockNumber).toBe(initialBlockNumber)

			// Verify transaction is in txPool
			const txPool = await client.transport.tevm.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddress(PREFUNDED_PRIVATE_KEYS[0]))
			expect(pooledTxs).toHaveLength(1)
			expect(bytesToHex(pooledTxs[0].tx.hash())).toBe(txHash)
		})
	})

	describe('eth_estimateGas should NOT trigger automining', () => {
		it('should not mine blocks during gas estimation', async () => {
			const client = createMemoryClient({
				miningConfig: { type: 'auto' },
				loggingLevel: 'debug',
			})

			const initialBlockNumber = await client.getBlockNumber()

			// Estimate gas for transaction
			const gasEstimate = await client.request({
				method: 'eth_estimateGas',
				params: [
					{
						from: `0x${PREFUNDED_PRIVATE_KEYS[0].slice(2)}`,
						to: `0x${'42'.repeat(20)}`,
						value: '0x16345785d8a0000', // 0.1 ETH
						data: '0x',
					},
				],
			})

			expect(gasEstimate).toBeTruthy()
			expect(typeof gasEstimate).toBe('string')

			// Block number should not have changed
			const finalBlockNumber = await client.getBlockNumber()
			expect(finalBlockNumber).toBe(initialBlockNumber)

			const txPool = await client.transport.tevm.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddress(PREFUNDED_PRIVATE_KEYS[0]))
			expect(pooledTxs).toHaveLength(0)
		})

		it('should not create transactions during gas estimation with same nonce', async () => {
			const client = createMemoryClient({
				miningConfig: { type: 'auto' },
				loggingLevel: 'debug',
			})

			// Estimate gas multiple times with same nonce
			for (let i = 0; i < 3; i++) {
				const gasEstimate = await client.request({
					method: 'eth_estimateGas',
					params: [
						{
							from: `0x${PREFUNDED_PRIVATE_KEYS[0].slice(2)}`,
							to: `0x${'42'.repeat(20)}`,
							value: '0x16345785d8a0000',
							data: '0x',
							nonce: '0x27', // Same nonce each time
						},
					],
				})

				expect(gasEstimate).toBeTruthy()
			}

			// TxPool should still be empty after multiple estimates
			const txPool = await client.transport.tevm.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddress(PREFUNDED_PRIVATE_KEYS[0]))
			expect(pooledTxs).toHaveLength(0)
		})
	})

	describe('nonce handling should preserve user-provided nonces', () => {
		it('should use user-provided nonce in raw transactions', async () => {
			const client = createMemoryClient({
				miningConfig: { type: 'auto' },
				loggingLevel: 'debug',
			})

			// Send transaction with explicit nonce
			const userNonce = 0x27n
			const tx = TransactionFactory(
				{
					nonce: `0x${userNonce.toString(16)}`,
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x2710',
					to: createAddress(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			const txHash = await client.request({
				method: 'eth_sendRawTransaction',
				params: [bytesToHex(serializedTx)],
			})

			const receipt = await client.request({
				method: 'eth_getTransactionReceipt',
				params: [txHash],
			})

			expect(receipt).toBeTruthy()
			expect(receipt).toHaveProperty('transactionHash', txHash)
			// The raw transaction already contains the nonce, so it should be preserved
			expect(signedTx.nonce).toBe(userNonce)
		})
	})
})
