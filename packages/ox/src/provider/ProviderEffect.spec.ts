import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { ProviderEffectLive, ProviderEffectService } from './ProviderEffect.js'

describe('ProviderEffect', () => {
	const provider: ProviderEffectService = ProviderEffectLive

	it('should get block number', async () => {
		const result = await Effect.runPromise(provider.getBlockNumberEffect())
		expect(typeof result).toBe('bigint')
	})

	it('should get chain ID', async () => {
		const result = await Effect.runPromise(provider.getChainIdEffect())
		expect(typeof result).toBe('number')
	})

	it('should get gas price', async () => {
		const result = await Effect.runPromise(provider.getGasPriceEffect())
		expect(typeof result).toBe('bigint')
	})

	it('should get balance', async () => {
		const address = '0x1234567890123456789012345678901234567890'
		const result = await Effect.runPromise(provider.getBalanceEffect(address))
		expect(typeof result).toBe('bigint')
	})

	it('should get code', async () => {
		const address = '0x1234567890123456789012345678901234567890'
		const result = await Effect.runPromise(provider.getCodeEffect(address))
		expect(typeof result).toBe('string')
	})

	it('should get storage at', async () => {
		const address = '0x1234567890123456789012345678901234567890'
		const slot = 0n
		const result = await Effect.runPromise(provider.getStorageAtEffect(address, slot))
		expect(typeof result).toBe('string')
	})

	it('should get transaction count', async () => {
		const address = '0x1234567890123456789012345678901234567890'
		const result = await Effect.runPromise(provider.getTransactionCountEffect(address))
		expect(typeof result).toBe('number')
	})

	it('should get transaction', async () => {
		const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'
		const result = await Effect.runPromise(provider.getTransactionEffect(hash))
		expect(result).toBeNull()
	})

	it('should get transaction receipt', async () => {
		const hash = '0x1234567890123456789012345678901234567890123456789012345678901234'
		const result = await Effect.runPromise(provider.getTransactionReceiptEffect(hash))
		expect(result).toBeNull()
	})

	it('should get logs', async () => {
		const filter = {
			fromBlock: 'latest',
			toBlock: 'latest',
			address: '0x1234567890123456789012345678901234567890',
		}
		const result = await Effect.runPromise(provider.getLogsEffect(filter))
		expect(Array.isArray(result)).toBe(true)
	})

	it('should estimate gas', async () => {
		const transaction = {
			to: '0x1234567890123456789012345678901234567890',
			value: 0n,
		}
		const result = await Effect.runPromise(provider.estimateGasEffect(transaction))
		expect(typeof result).toBe('bigint')
	})

	it('should get block', async () => {
		const result = await Effect.runPromise(provider.getBlockEffect('latest'))
		expect(result).toBeNull()
	})

	it('should get block with transactions', async () => {
		const result = await Effect.runPromise(provider.getBlockWithTransactionsEffect('latest'))
		expect(result).toBeNull()
	})
})
