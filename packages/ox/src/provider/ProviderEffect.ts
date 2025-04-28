import { Context, Effect, Layer } from 'effect'
import * as Provider from 'ox/provider'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Provider
 */
export type ProviderEffect = Provider.Provider

/**
 * Ox Provider effect service interface
 */
export interface ProviderEffectService {
	/**
	 * Get block number with Effect
	 */
	getBlockNumberEffect(): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get chain ID with Effect
	 */
	getChainIdEffect(): Effect.Effect<number, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get gas price with Effect
	 */
	getGasPriceEffect(): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get balance with Effect
	 */
	getBalanceEffect(address: string): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get code with Effect
	 */
	getCodeEffect(address: string): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get storage at with Effect
	 */
	getStorageAtEffect(address: string, slot: bigint): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get transaction count with Effect
	 */
	getTransactionCountEffect(address: string): Effect.Effect<number, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get transaction with Effect
	 */
	getTransactionEffect(
		hash: string,
	): Effect.Effect<Provider.Transaction | null, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get transaction receipt with Effect
	 */
	getTransactionReceiptEffect(
		hash: string,
	): Effect.Effect<Provider.TransactionReceipt | null, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get logs with Effect
	 */
	getLogsEffect(filter: Provider.Filter): Effect.Effect<Provider.Log[], BaseErrorEffect<Error | undefined>, never>

	/**
	 * Estimate gas with Effect
	 */
	estimateGasEffect(
		transaction: Provider.TransactionRequest,
	): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get block with Effect
	 */
	getBlockEffect(
		blockNumber: bigint | 'latest' | 'earliest' | 'pending',
	): Effect.Effect<Provider.Block | null, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get block with transactions with Effect
	 */
	getBlockWithTransactionsEffect(
		blockNumber: bigint | 'latest' | 'earliest' | 'pending',
	): Effect.Effect<Provider.BlockWithTransactions | null, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for ProviderEffectService dependency injection
 */
export const ProviderEffectTag = Context.Tag<ProviderEffectService>('@tevm/ox/ProviderEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}

/**
 * Live implementation of ProviderEffectService
 */
export const ProviderEffectLive: ProviderEffectService = {
	getBlockNumberEffect: () => catchOxErrors(Effect.try(() => Provider.getBlockNumber())),

	getChainIdEffect: () => catchOxErrors(Effect.try(() => Provider.getChainId())),

	getGasPriceEffect: () => catchOxErrors(Effect.try(() => Provider.getGasPrice())),

	getBalanceEffect: (address) => catchOxErrors(Effect.try(() => Provider.getBalance(address))),

	getCodeEffect: (address) => catchOxErrors(Effect.try(() => Provider.getCode(address))),

	getStorageAtEffect: (address, slot) => catchOxErrors(Effect.try(() => Provider.getStorageAt(address, slot))),

	getTransactionCountEffect: (address) => catchOxErrors(Effect.try(() => Provider.getTransactionCount(address))),

	getTransactionEffect: (hash) => catchOxErrors(Effect.try(() => Provider.getTransaction(hash))),

	getTransactionReceiptEffect: (hash) => catchOxErrors(Effect.try(() => Provider.getTransactionReceipt(hash))),

	getLogsEffect: (filter) => catchOxErrors(Effect.try(() => Provider.getLogs(filter))),

	estimateGasEffect: (transaction) => catchOxErrors(Effect.try(() => Provider.estimateGas(transaction))),

	getBlockEffect: (blockNumber) => catchOxErrors(Effect.try(() => Provider.getBlock(blockNumber))),

	getBlockWithTransactionsEffect: (blockNumber) =>
		catchOxErrors(Effect.try(() => Provider.getBlockWithTransactions(blockNumber))),
}

/**
 * Layer that provides the ProviderEffectService implementation
 */
export const ProviderEffectLayer = Layer.succeed(ProviderEffectTag, ProviderEffectLive)
