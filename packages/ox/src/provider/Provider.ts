import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type Provider = Ox.Provider.Provider
export type Transaction = Ox.Provider.Transaction
export type TransactionReceipt = Ox.Provider.TransactionReceipt
export type Filter = Ox.Provider.Filter
export type TransactionRequest = Ox.Provider.TransactionRequest
export type Block = Ox.Provider.Block
export type BlockWithTransactions = Ox.Provider.BlockWithTransactions
export type Log = Ox.Provider.Log

/**
 * Error class for getBlockNumber function
 */
export class GetBlockNumberError extends Error {
	override name = 'GetBlockNumberError'
	_tag = 'GetBlockNumberError'
	constructor(cause: unknown) {
		super('Unexpected error getting block number with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get block number
 */
export function getBlockNumber(): Effect.Effect<bigint, GetBlockNumberError, never> {
	return Effect.try({
		try: () => Ox.Provider.getBlockNumber(),
		catch: (cause) => new GetBlockNumberError(cause),
	})
}

/**
 * Error class for getChainId function
 */
export class GetChainIdError extends Error {
	override name = 'GetChainIdError'
	_tag = 'GetChainIdError'
	constructor(cause: unknown) {
		super('Unexpected error getting chain ID with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get chain ID
 */
export function getChainId(): Effect.Effect<number, GetChainIdError, never> {
	return Effect.try({
		try: () => Ox.Provider.getChainId(),
		catch: (cause) => new GetChainIdError(cause),
	})
}

/**
 * Error class for getGasPrice function
 */
export class GetGasPriceError extends Error {
	override name = 'GetGasPriceError'
	_tag = 'GetGasPriceError'
	constructor(cause: unknown) {
		super('Unexpected error getting gas price with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get gas price
 */
export function getGasPrice(): Effect.Effect<bigint, GetGasPriceError, never> {
	return Effect.try({
		try: () => Ox.Provider.getGasPrice(),
		catch: (cause) => new GetGasPriceError(cause),
	})
}

/**
 * Error class for getBalance function
 */
export class GetBalanceError extends Error {
	override name = 'GetBalanceError'
	_tag = 'GetBalanceError'
	constructor(cause: unknown) {
		super('Unexpected error getting balance with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get balance
 */
export function getBalance(address: string): Effect.Effect<bigint, GetBalanceError, never> {
	return Effect.try({
		try: () => Ox.Provider.getBalance(address),
		catch: (cause) => new GetBalanceError(cause),
	})
}

/**
 * Error class for getCode function
 */
export class GetCodeError extends Error {
	override name = 'GetCodeError'
	_tag = 'GetCodeError'
	constructor(cause: unknown) {
		super('Unexpected error getting code with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get code
 */
export function getCode(address: string): Effect.Effect<string, GetCodeError, never> {
	return Effect.try({
		try: () => Ox.Provider.getCode(address),
		catch: (cause) => new GetCodeError(cause),
	})
}

/**
 * Error class for getStorageAt function
 */
export class GetStorageAtError extends Error {
	override name = 'GetStorageAtError'
	_tag = 'GetStorageAtError'
	constructor(cause: unknown) {
		super('Unexpected error getting storage at with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get storage at
 */
export function getStorageAt(address: string, slot: bigint): Effect.Effect<string, GetStorageAtError, never> {
	return Effect.try({
		try: () => Ox.Provider.getStorageAt(address, slot),
		catch: (cause) => new GetStorageAtError(cause),
	})
}

/**
 * Error class for getTransactionCount function
 */
export class GetTransactionCountError extends Error {
	override name = 'GetTransactionCountError'
	_tag = 'GetTransactionCountError'
	constructor(cause: unknown) {
		super('Unexpected error getting transaction count with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get transaction count
 */
export function getTransactionCount(address: string): Effect.Effect<number, GetTransactionCountError, never> {
	return Effect.try({
		try: () => Ox.Provider.getTransactionCount(address),
		catch: (cause) => new GetTransactionCountError(cause),
	})
}

/**
 * Error class for getTransaction function
 */
export class GetTransactionError extends Error {
	override name = 'GetTransactionError'
	_tag = 'GetTransactionError'
	constructor(cause: unknown) {
		super('Unexpected error getting transaction with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get transaction
 */
export function getTransaction(hash: string): Effect.Effect<Transaction | null, GetTransactionError, never> {
	return Effect.try({
		try: () => Ox.Provider.getTransaction(hash),
		catch: (cause) => new GetTransactionError(cause),
	})
}

/**
 * Error class for getTransactionReceipt function
 */
export class GetTransactionReceiptError extends Error {
	override name = 'GetTransactionReceiptError'
	_tag = 'GetTransactionReceiptError'
	constructor(cause: unknown) {
		super('Unexpected error getting transaction receipt with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get transaction receipt
 */
export function getTransactionReceipt(
	hash: string,
): Effect.Effect<TransactionReceipt | null, GetTransactionReceiptError, never> {
	return Effect.try({
		try: () => Ox.Provider.getTransactionReceipt(hash),
		catch: (cause) => new GetTransactionReceiptError(cause),
	})
}

/**
 * Error class for getLogs function
 */
export class GetLogsError extends Error {
	override name = 'GetLogsError'
	_tag = 'GetLogsError'
	constructor(cause: unknown) {
		super('Unexpected error getting logs with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get logs
 */
export function getLogs(filter: Filter): Effect.Effect<Log[], GetLogsError, never> {
	return Effect.try({
		try: () => Ox.Provider.getLogs(filter),
		catch: (cause) => new GetLogsError(cause),
	})
}

/**
 * Error class for estimateGas function
 */
export class EstimateGasError extends Error {
	override name = 'EstimateGasError'
	_tag = 'EstimateGasError'
	constructor(cause: unknown) {
		super('Unexpected error estimating gas with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Estimate gas
 */
export function estimateGas(transaction: TransactionRequest): Effect.Effect<bigint, EstimateGasError, never> {
	return Effect.try({
		try: () => Ox.Provider.estimateGas(transaction),
		catch: (cause) => new EstimateGasError(cause),
	})
}

/**
 * Error class for getBlock function
 */
export class GetBlockError extends Error {
	override name = 'GetBlockError'
	_tag = 'GetBlockError'
	constructor(cause: unknown) {
		super('Unexpected error getting block with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get block
 */
export function getBlock(
	blockNumber: bigint | 'latest' | 'earliest' | 'pending',
): Effect.Effect<Block | null, GetBlockError, never> {
	return Effect.try({
		try: () => Ox.Provider.getBlock(blockNumber),
		catch: (cause) => new GetBlockError(cause),
	})
}

/**
 * Error class for getBlockWithTransactions function
 */
export class GetBlockWithTransactionsError extends Error {
	override name = 'GetBlockWithTransactionsError'
	_tag = 'GetBlockWithTransactionsError'
	constructor(cause: unknown) {
		super('Unexpected error getting block with transactions with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get block with transactions
 */
export function getBlockWithTransactions(
	blockNumber: bigint | 'latest' | 'earliest' | 'pending',
): Effect.Effect<BlockWithTransactions | null, GetBlockWithTransactionsError, never> {
	return Effect.try({
		try: () => Ox.Provider.getBlockWithTransactions(blockNumber),
		catch: (cause) => new GetBlockWithTransactionsError(cause),
	})
}
