import { Effect } from 'effect'
import Ox from 'ox'

// Re-export types
export type CalculateNextBaseFeeParams = Ox.Fee.CalculateNextBaseFeeParams
export type CalculatePriorityFeeParams = Ox.Fee.CalculatePriorityFeeParams
export type CreateFeeHistoryParams = Ox.Fee.CreateFeeHistoryParams
export type FeeHistory = Ox.Fee.FeeHistory
export type FeeHistoryJson = Ox.Fee.FeeHistoryJson

/**
 * Error thrown when calculating the next base fee
 */
export class CalculateNextBaseFeeError extends Error {
  override name = 'CalculateNextBaseFeeError'
  _tag = 'CalculateNextBaseFeeError'
  constructor(cause: Ox.Fee.calculateNextBaseFee.ErrorType) {
    super('Unexpected error calculating next base fee with ox', {
      cause,
    })
  }
}

/**
 * Calculates the base fee for the next block based on the EIP-1559 formula
 * 
 * @param params - The parameters for calculating the next base fee
 * @returns The calculated base fee
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Fee from '@tevm/ox/fee'
 * 
 * const params = {
 *   parentBaseFeePerGas: 1000000000n, // Current block's base fee
 *   parentGasUsed: 15000000n,         // Current block's gas used
 *   parentGasLimit: 30000000n,        // Current block's gas limit
 * }
 * 
 * const program = Fee.calculateNextBaseFee(params)
 * const nextBaseFee = await Effect.runPromise(program)
 * // nextBaseFee: 1031250000n
 * ```
 */
export function calculateNextBaseFee(
  params: CalculateNextBaseFeeParams,
): Effect.Effect<bigint, CalculateNextBaseFeeError, never> {
  return Effect.try({
    try: () => Ox.Fee.calculateNextBaseFee(params),
    catch: (cause) => new CalculateNextBaseFeeError(cause as Ox.Fee.calculateNextBaseFee.ErrorType),
  })
}

/**
 * Error thrown when calculating the priority fee
 */
export class CalculatePriorityFeeError extends Error {
  override name = 'CalculatePriorityFeeError'
  _tag = 'CalculatePriorityFeeError'
  constructor(cause: Ox.Fee.calculatePriorityFee.ErrorType) {
    super('Unexpected error calculating priority fee with ox', {
      cause,
    })
  }
}

/**
 * Calculates the EIP-1559 priority fee based on the base fee and max fee
 * 
 * @param params - The parameters for calculating the priority fee
 * @returns The calculated priority fee
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Fee from '@tevm/ox/fee'
 * 
 * const params = {
 *   baseFeePerGas: 1000000000n, // Current base fee
 *   maxFeePerGas: 2000000000n,  // Max fee set by user
 * }
 * 
 * const program = Fee.calculatePriorityFee(params)
 * const priorityFee = await Effect.runPromise(program)
 * // priorityFee: 1000000000n
 * ```
 */
export function calculatePriorityFee(
  params: CalculatePriorityFeeParams,
): Effect.Effect<bigint, CalculatePriorityFeeError, never> {
  return Effect.try({
    try: () => Ox.Fee.calculatePriorityFee(params),
    catch: (cause) => new CalculatePriorityFeeError(cause as Ox.Fee.calculatePriorityFee.ErrorType),
  })
}

/**
 * Error thrown when creating a fee history
 */
export class CreateFeeHistoryError extends Error {
  override name = 'CreateFeeHistoryError'
  _tag = 'CreateFeeHistoryError'
  constructor(cause: Ox.Fee.createFeeHistory.ErrorType) {
    super('Unexpected error creating fee history with ox', {
      cause,
    })
  }
}

/**
 * Creates an EIP-1559 fee history from blocks
 * 
 * @param params - The parameters for creating the fee history
 * @returns The created fee history
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Fee from '@tevm/ox/fee'
 * 
 * const params = {
 *   blocks: [
 *     { baseFeePerGas: 1000000000n, gasUsed: 15000000n, gasLimit: 30000000n },
 *     { baseFeePerGas: 1031250000n, gasUsed: 16000000n, gasLimit: 30000000n },
 *   ],
 *   percentiles: [25, 50, 75],
 * }
 * 
 * const program = Fee.createFeeHistory(params)
 * const feeHistory = await Effect.runPromise(program)
 * // feeHistory contains the calculated fee history
 * ```
 */
export function createFeeHistory(
  params: CreateFeeHistoryParams,
): Effect.Effect<FeeHistory, CreateFeeHistoryError, never> {
  return Effect.try({
    try: () => Ox.Fee.createFeeHistory(params),
    catch: (cause) => new CreateFeeHistoryError(cause as Ox.Fee.createFeeHistory.ErrorType),
  })
}

/**
 * Error thrown when formatting a fee history
 */
export class FormatFeeHistoryError extends Error {
  override name = 'FormatFeeHistoryError'
  _tag = 'FormatFeeHistoryError'
  constructor(cause: Ox.Fee.formatFeeHistory.ErrorType) {
    super('Unexpected error formatting fee history with ox', {
      cause,
    })
  }
}

/**
 * Formats a fee history to JSON
 * 
 * @param feeHistory - The fee history to format
 * @returns The formatted fee history in JSON format
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Fee from '@tevm/ox/fee'
 * 
 * const feeHistory = {
 *   baseFeePerGas: [1000000000n, 1031250000n],
 *   gasUsedRatio: [0.5, 0.533],
 *   oldestBlock: 0n,
 *   reward: [[250000000n, 500000000n, 750000000n], [260000000n, 515000000n, 775000000n]],
 * }
 * 
 * const program = Fee.formatFeeHistory(feeHistory)
 * const formattedHistory = await Effect.runPromise(program)
 * // formattedHistory contains the JSON representation of the fee history
 * ```
 */
export function formatFeeHistory(
  feeHistory: FeeHistory,
): Effect.Effect<FeeHistoryJson, FormatFeeHistoryError, never> {
  return Effect.try({
    try: () => Ox.Fee.formatFeeHistory(feeHistory),
    catch: (cause) => new FormatFeeHistoryError(cause as Ox.Fee.formatFeeHistory.ErrorType),
  })
}

/**
 * Error thrown when parsing a fee history
 */
export class ParseFeeHistoryError extends Error {
  override name = 'ParseFeeHistoryError'
  _tag = 'ParseFeeHistoryError'
  constructor(cause: Ox.Fee.parseFeeHistory.ErrorType) {
    super('Unexpected error parsing fee history with ox', {
      cause,
    })
  }
}

/**
 * Parses a fee history from JSON
 * 
 * @param feeHistoryJson - The fee history JSON to parse
 * @returns The parsed fee history
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Fee from '@tevm/ox/fee'
 * 
 * const feeHistoryJson = {
 *   baseFeePerGas: ['0x3b9aca00', '0x3d6c6cfc'],
 *   gasUsedRatio: [0.5, 0.533],
 *   oldestBlock: '0x0',
 *   reward: [['0xee6b280', '0x1dcd6500', '0x2cb41780'], ['0xf7ac000', '0x1eb1c200', '0x2e52c400']],
 * }
 * 
 * const program = Fee.parseFeeHistory(feeHistoryJson)
 * const parsedHistory = await Effect.runPromise(program)
 * // parsedHistory contains the parsed fee history
 * ```
 */
export function parseFeeHistory(
  feeHistoryJson: FeeHistoryJson,
): Effect.Effect<FeeHistory, ParseFeeHistoryError, never> {
  return Effect.try({
    try: () => Ox.Fee.parseFeeHistory(feeHistoryJson),
    catch: (cause) => new ParseFeeHistoryError(cause as Ox.Fee.parseFeeHistory.ErrorType),
  })
}