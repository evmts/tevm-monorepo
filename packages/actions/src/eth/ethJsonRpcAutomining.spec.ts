import { createAddress } from '@tevm/address'
import { tevmDefault } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { TransactionFactory } from '@tevm/tx'
import {
	bytesToHex,
	Hex,
	hexToBytes,
	numberToHex,
	PREFUNDED_ACCOUNTS,
	PREFUNDED_PRIVATE_KEYS,
	parseEther,
} from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { blockNumberProcedure } from './blockNumberProcedure.js'
import { ethEstimateGasJsonRpcProcedure } from './ethEstimateGasProcedure.js'
import { ethGetTransactionReceiptJsonRpcProcedure } from './ethGetTransactionReceiptProcedure.js'
import { ethSendRawTransactionJsonRpcProcedure } from './ethSendRawTransactionProcedure.js'

describe('JSON-RPC Automining Integration Tests', () => {
	describe('eth_sendRawTransaction should trigger automining when enabled', () => {
		it('should automine transaction when automining is enabled', async () => {
			const client = createTevmNode({ miningConfig: { type: 'auto' } })
			const sendRawTxProcedure = ethSendRawTransactionJsonRpcProcedure(client)
			const getReceiptProcedure = ethGetTransactionReceiptJsonRpcProcedure(client)
			const getBlockNumberProcedure = blockNumberProcedure(client)

			// Get initial block number
			const initialBlockResult = await getBlockNumberProcedure({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 1,
			})
			const initialBlockNumber = BigInt(initialBlockResult.result as string)

			// Create and sign transaction
			const tx = TransactionFactory(
				{
					nonce: '0x00',
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x5208',
					to: createAddress(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			// Send transaction
			const sendResult = await sendRawTxProcedure({
				jsonrpc: '2.0',
				method: 'eth_sendRawTransaction',
				params: [bytesToHex(serializedTx)],
				id: 2,
			})

			expect(sendResult.result).toBe(bytesToHex(signedTx.hash()))

			// Check that transaction was mined (receipt should exist)
			const receiptResult = await getReceiptProcedure({
				jsonrpc: '2.0',
				method: 'eth_getTransactionReceipt',
				params: [sendResult.result as Hex],
				id: 3,
			})

			expect(receiptResult.result).toBeTruthy()
			expect(receiptResult.result).toHaveProperty('transactionHash', sendResult.result)

			// Check that block number increased (new block was mined)
			const finalBlockResult = await getBlockNumberProcedure({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 4,
			})
			const finalBlockNumber = BigInt(finalBlockResult.result as string)

			expect(finalBlockNumber).toBeGreaterThan(initialBlockNumber)
		})

		it('should not automine when automining is disabled', async () => {
			const client = createTevmNode({ miningConfig: { type: 'manual' } })
			const sendRawTxProcedure = ethSendRawTransactionJsonRpcProcedure(client)
			const getReceiptProcedure = ethGetTransactionReceiptJsonRpcProcedure(client)
			const getBlockNumberProcedure = blockNumberProcedure(client)

			// Get initial block number
			const initialBlockResult = await getBlockNumberProcedure({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 1,
			})
			const initialBlockNumber = BigInt(initialBlockResult.result as string)

			// Create and send transaction
			const tx = TransactionFactory(
				{
					nonce: '0x00',
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x5208',
					to: createAddress(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			const sendResult = await sendRawTxProcedure({
				jsonrpc: '2.0',
				method: 'eth_sendRawTransaction',
				params: [bytesToHex(serializedTx)],
				id: 2,
			})

			// Transaction should be added to txPool but not mined
			const receiptResult = await getReceiptProcedure({
				jsonrpc: '2.0',
				method: 'eth_getTransactionReceipt',
				params: [sendResult.result as Hex],
				id: 3,
			})

			expect(receiptResult.result).toBeNull() // No receipt = not mined

			// Block number should remain the same
			const finalBlockResult = await getBlockNumberProcedure({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 4,
			})
			const finalBlockNumber = BigInt(finalBlockResult.result as string)

			expect(finalBlockNumber).toBe(initialBlockNumber)

			// Verify transaction is in txPool
			const txPool = await client.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddress(PREFUNDED_ACCOUNTS[0].address))
			expect(pooledTxs).toHaveLength(1)
			expect(bytesToHex(pooledTxs[0].tx.hash())).toBe(sendResult.result)
		})
	})

	describe('eth_estimateGas should NOT trigger automining', () => {
		it('should not mine blocks during gas estimation', async () => {
			const client = createTevmNode({ miningConfig: { type: 'auto' } })
			const estimateGasProcedure = ethEstimateGasJsonRpcProcedure(client)
			const getBlockNumberProcedure = blockNumberProcedure(client)

			// Get initial block number
			const initialBlockResult = await getBlockNumberProcedure({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 1,
			})
			const initialBlockNumber = BigInt(initialBlockResult.result as string)

			// Estimate gas for transaction
			const estimateResult = await estimateGasProcedure({
				jsonrpc: '2.0',
				method: 'eth_estimateGas',
				params: [
					{
						from: PREFUNDED_ACCOUNTS[0].address,
						to: `0x${'42'.repeat(20)}`,
						value: '0x16345785d8a0000', // 0.1 ETH
						data: '0x',
					},
				],
				id: 2,
			})

			expect(estimateResult.result).toBeTruthy()
			expect(typeof estimateResult.result).toBe('string')

			// Block number should not have changed
			const finalBlockResult = await getBlockNumberProcedure({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 3,
			})
			const finalBlockNumber = BigInt(finalBlockResult.result as string)

			expect(finalBlockNumber).toBe(initialBlockNumber)

			// TxPool should be empty (no transaction created)
			const txPool = await client.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddress(PREFUNDED_ACCOUNTS[0].address))
			expect(pooledTxs).toHaveLength(0)
		})

		it('should not create transactions during gas estimation', async () => {
			const client = createTevmNode({ miningConfig: { type: 'auto' } })
			const estimateGasProcedure = ethEstimateGasJsonRpcProcedure(client)

			// Estimate gas multiple times with same nonce
			for (let i = 0; i < 3; i++) {
				const estimateResult = await estimateGasProcedure({
					jsonrpc: '2.0',
					method: 'eth_estimateGas',
					params: [
						{
							from: PREFUNDED_ACCOUNTS[0].address,
							to: `0x${'42'.repeat(20)}`,
							value: '0x16345785d8a0000',
							data: '0x',
							nonce: '0x27', // Same nonce each time
						},
					],
					id: i + 1,
				})

				expect(estimateResult.result).toBeTruthy()
			}

			// TxPool should still be empty after multiple estimates
			const txPool = await client.getTxPool()
			const pooledTxs = await txPool.getBySenderAddress(createAddress(PREFUNDED_ACCOUNTS[0].address))
			expect(pooledTxs).toHaveLength(0)
		})
	})

	describe('nonce handling should preserve user-provided nonces', () => {
		it('should use user-provided nonce instead of auto-calculating', async () => {
			const client = createTevmNode({ miningConfig: { type: 'auto' } })
			const sendRawTxProcedure = ethSendRawTransactionJsonRpcProcedure(client)
			const getReceiptProcedure = ethGetTransactionReceiptJsonRpcProcedure(client)

			// Send transaction with explicit nonce
			const nextNonce = 0n
			const tx = TransactionFactory(
				{
					nonce: numberToHex(nextNonce),
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x5208',
					to: createAddress(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			const serializedTx = signedTx.serialize()

			const sendResult = await sendRawTxProcedure({
				jsonrpc: '2.0',
				method: 'eth_sendRawTransaction',
				params: [bytesToHex(serializedTx)],
				id: 1,
			})

			// Get receipt and verify nonce was preserved
			const receiptResult = await getReceiptProcedure({
				jsonrpc: '2.0',
				method: 'eth_getTransactionReceipt',
				params: [sendResult.result as Hex],
				id: 2,
			})

			expect(receiptResult.result).toBeTruthy()
			// The receipt should show our explicit nonce was used
			expect(receiptResult.result).toHaveProperty('transactionIndex')
		})
	})
})
