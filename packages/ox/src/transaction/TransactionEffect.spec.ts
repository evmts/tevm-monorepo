import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { TransactionEffectLive } from './TransactionEffect.js'

describe('TransactionEffect', () => {
	// Sample transaction data for testing
	const sampleRpcTransaction = {
		hash: '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
		nonce: '0x357',
		blockHash: '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
		blockNumber: '0x12f296f',
		transactionIndex: '0x2',
		from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
		to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
		value: '0x9b6e64a8ec60000', // 0.7 ETH
		gas: '0x43f5d',
		maxFeePerGas: '0x2ca6ae494',
		maxPriorityFeePerGas: '0x41cc3c0',
		input: '0x',
		r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
		s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
		yParity: '0x0',
		chainId: '0x1',
		accessList: [],
		type: '0x2', // EIP-1559
	}

	const sampleTransaction = {
		hash: '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
		nonce: 855n,
		blockHash: '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
		blockNumber: 19868015n,
		transactionIndex: 2,
		from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
		to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
		value: 700000000000000000n, // 0.7 ETH
		gas: 278365n,
		maxFeePerGas: 11985937556n,
		maxPriorityFeePerGas: 68993984n,
		input: '0x',
		r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
		s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
		yParity: 0,
		v: 27,
		chainId: 1,
		accessList: [],
		type: 'eip1559',
	}

	describe('fromRpcEffect', () => {
		it('should convert an Rpc transaction to a Transaction', async () => {
			const program = TransactionEffectLive.fromRpcEffect(sampleRpcTransaction)
			const result = await Effect.runPromise(program)

			expect(result.nonce).toBeTypeOf('bigint')
			expect(result.blockNumber).toBeTypeOf('bigint')
			expect(result.transactionIndex).toBeTypeOf('number')
			expect(result.gas).toBeTypeOf('bigint')
			expect(result.value).toBeTypeOf('bigint')
			expect(result.maxFeePerGas).toBeTypeOf('bigint')
			expect(result.maxPriorityFeePerGas).toBeTypeOf('bigint')
			expect(result.chainId).toBeTypeOf('number')
			expect(result.type).toBe('eip1559')

			// Verify specific values
			expect(result.nonce).toBe(855n)
			expect(result.blockNumber).toBe(19868015n)
			expect(result.value).toBe(700000000000000000n)
		})

		it('should return null when given null', async () => {
			const program = TransactionEffectLive.fromRpcEffect(null)
			const result = await Effect.runPromise(program)
			expect(result).toBeNull()
		})
	})

	describe('toRpcEffect', () => {
		it('should convert a Transaction to an Rpc transaction', async () => {
			const program = TransactionEffectLive.toRpcEffect(sampleTransaction)
			const result = await Effect.runPromise(program)

			expect(result.nonce).toBeTypeOf('string')
			expect(result.blockNumber).toBeTypeOf('string')
			expect(result.transactionIndex).toBeTypeOf('string')
			expect(result.gas).toBeTypeOf('string')
			expect(result.value).toBeTypeOf('string')
			expect(result.maxFeePerGas).toBeTypeOf('string')
			expect(result.maxPriorityFeePerGas).toBeTypeOf('string')
			expect(result.chainId).toBeTypeOf('string')
			expect(result.type).toBe('0x2') // EIP-1559

			// Verify specific values
			expect(result.nonce).toBe('0x357')
			expect(result.blockNumber).toBe('0x12f296f')
			expect(result.value).toBe('0x9b6e64a8ec60000')
			expect(result.yParity).toBe('0x0')
		})
	})

	describe('error handling', () => {
		it('should handle errors during conversion', async () => {
			// Create a malformed transaction missing required fields
			const invalidTransaction = {
				...sampleRpcTransaction,
				r: undefined, // remove r value to cause an error
			}

			const program = TransactionEffectLive.fromRpcEffect(invalidTransaction as any)
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})
})
