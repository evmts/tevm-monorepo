import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { TransactionReceiptEffectLive } from './TransactionReceiptEffect.js'

describe('TransactionReceiptEffect', () => {
	// Sample receipt data for testing
	const sampleRpcReceipt = {
		blockHash: '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
		blockNumber: '0x12f296f',
		contractAddress: null,
		cumulativeGasUsed: '0x82515',
		effectiveGasPrice: '0x21c2f6c09',
		from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
		gasUsed: '0x2abba',
		logs: [],
		logsBloom:
			'0x00200000000000000000008080000000000000000040000000000000000000000000000000000000000000000000000022000000080000000000000000000000000000080000000000000008000000200000000000000000000200008020400000000000000000280000000000100000000000000000000000000010000000000000000000020000000000000020000000000001000000080000004000000000000000000000000000000000000000000000400000000000001000000000000000000002000000000000000020000000000000000000001000000000000000000000200000000000000000000000000000001000000000c00000000000000000',
		status: '0x1',
		to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
		transactionHash: '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
		transactionIndex: '0x2',
		type: '0x2',
		blobGasPrice: '0x42069',
		blobGasUsed: '0x1337',
	}

	const sampleReceipt = {
		blockHash: '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
		blockNumber: 19868015n,
		contractAddress: null,
		cumulativeGasUsed: 533781n,
		effectiveGasPrice: 9062804489n,
		from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
		gasUsed: 175034n,
		logs: [],
		logsBloom:
			'0x00200000000000000000008080000000000000000040000000000000000000000000000000000000000000000000000022000000080000000000000000000000000000080000000000000008000000200000000000000000000200008020400000000000000000280000000000100000000000000000000000000010000000000000000000020000000000000020000000000001000000080000004000000000000000000000000000000000000000000000400000000000001000000000000000000002000000000000000020000000000000000000001000000000000000000000200000000000000000000000000000001000000000c00000000000000000',
		status: 'success',
		to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
		transactionHash: '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
		transactionIndex: 2,
		type: 'eip1559',
		blobGasPrice: 270441n,
		blobGasUsed: 4919n,
	}

	describe('fromRpcEffect', () => {
		it('should convert an Rpc receipt to a TransactionReceipt', async () => {
			const program = TransactionReceiptEffectLive.fromRpcEffect(sampleRpcReceipt)
			const result = await Effect.runPromise(program)

			expect(result.blockNumber).toBeTypeOf('bigint')
			expect(result.cumulativeGasUsed).toBeTypeOf('bigint')
			expect(result.effectiveGasPrice).toBeTypeOf('bigint')
			expect(result.gasUsed).toBeTypeOf('bigint')
			expect(result.transactionIndex).toBeTypeOf('number')
			expect(result.status).toBe('success')
			expect(result.type).toBe('eip1559')
			expect(result.blobGasPrice).toBeTypeOf('bigint')
			expect(result.blobGasUsed).toBeTypeOf('bigint')

			// Verify specific values
			expect(result.blockNumber).toBe(19868015n)
			expect(result.cumulativeGasUsed).toBe(533781n)
			expect(result.blobGasPrice).toBe(270441n)
			expect(result.blobGasUsed).toBe(4919n)
		})

		it('should return null when given null', async () => {
			const program = TransactionReceiptEffectLive.fromRpcEffect(null)
			const result = await Effect.runPromise(program)
			expect(result).toBeNull()
		})
	})

	describe('toRpcEffect', () => {
		it('should convert a TransactionReceipt to an Rpc receipt', async () => {
			const program = TransactionReceiptEffectLive.toRpcEffect(sampleReceipt)
			const result = await Effect.runPromise(program)

			expect(result.blockNumber).toBeTypeOf('string')
			expect(result.cumulativeGasUsed).toBeTypeOf('string')
			expect(result.effectiveGasPrice).toBeTypeOf('string')
			expect(result.gasUsed).toBeTypeOf('string')
			expect(result.transactionIndex).toBeTypeOf('string')
			expect(result.status).toBe('0x1')
			expect(result.type).toBe('0x2') // EIP-1559
			expect(result.blobGasPrice).toBeTypeOf('string')
			expect(result.blobGasUsed).toBeTypeOf('string')

			// Verify specific values
			expect(result.blockNumber).toBe('0x12f296f')
			expect(result.cumulativeGasUsed).toBe('0x82515')
			expect(result.blobGasPrice).toBe('0x42069')
			expect(result.blobGasUsed).toBe('0x1337')
		})
	})

	describe('error handling', () => {
		it('should handle errors during conversion', async () => {
			// Create a malformed receipt missing required fields
			const invalidReceipt = {
				...sampleRpcReceipt,
				logs: undefined, // remove logs to cause an error
			}

			const program = TransactionReceiptEffectLive.fromRpcEffect(invalidReceipt as any)
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})
})
