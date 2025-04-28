import { Effect } from 'effect'
import Ox from 'ox'

// Export types
export type CalculateNextBaseFeeParams = Ox.Fee.CalculateNextBaseFeeParams
export type CalculatePriorityFeeParams = Ox.Fee.CalculatePriorityFeeParams
export type CreateFeeHistoryParams = Ox.Fee.CreateFeeHistoryParams
export type FeeHistory = Ox.Fee.FeeHistory
export type FeeHistoryJson = Ox.Fee.FeeHistoryJson

/**
 * Error class for calculateNextBaseFee function
 */
export class CalculateNextBaseFeeError extends Error {
	override name = 'CalculateNextBaseFeeError'
	_tag = 'CalculateNextBaseFeeError'
	constructor(cause: unknown) {
		super('Failed to calculate next base fee with ox', {
			cause,
		})
	}
}

/**
 * Calculates the base fee for the next block
 * @param params Parameters for calculating the next base fee
 * @returns An Effect that succeeds with the next base fee
 */
export function calculateNextBaseFee(
	params: CalculateNextBaseFeeParams,
): Effect.Effect<bigint, CalculateNextBaseFeeError, never> {
	return Effect.try({
		try: () => Ox.Fee.calculateNextBaseFee(params),
		catch: (cause) => new CalculateNextBaseFeeError(cause),
	})
}

/**
 * Error class for calculatePriorityFee function
 */
export class CalculatePriorityFeeError extends Error {
	override name = 'CalculatePriorityFeeError'
	_tag = 'CalculatePriorityFeeError'
	constructor(cause: unknown) {
		super('Failed to calculate priority fee with ox', {
			cause,
		})
	}
}

/**
 * Calculates the EIP-1559 priority fee
 * @param params Parameters for calculating the priority fee
 * @returns An Effect that succeeds with the priority fee
 */
export function calculatePriorityFee(
	params: CalculatePriorityFeeParams,
): Effect.Effect<bigint, CalculatePriorityFeeError, never> {
	return Effect.try({
		try: () => Ox.Fee.calculatePriorityFee(params),
		catch: (cause) => new CalculatePriorityFeeError(cause),
	})
}

/**
 * Error class for createFeeHistory function
 */
export class CreateFeeHistoryError extends Error {
	override name = 'CreateFeeHistoryError'
	_tag = 'CreateFeeHistoryError'
	constructor(cause: unknown) {
		super('Failed to create fee history with ox', {
			cause,
		})
	}
}

/**
 * Creates an EIP-1559 fee history from blocks
 * @param params Parameters for creating the fee history
 * @returns An Effect that succeeds with the fee history
 */
export function createFeeHistory(
	params: CreateFeeHistoryParams,
): Effect.Effect<FeeHistory, CreateFeeHistoryError, never> {
	return Effect.try({
		try: () => Ox.Fee.createFeeHistory(params),
		catch: (cause) => new CreateFeeHistoryError(cause),
	})
}

/**
 * Error class for formatFeeHistory function
 */
export class FormatFeeHistoryError extends Error {
	override name = 'FormatFeeHistoryError'
	_tag = 'FormatFeeHistoryError'
	constructor(cause: unknown) {
		super('Failed to format fee history with ox', {
			cause,
		})
	}
}

/**
 * Formats a fee history to JSON
 * @param feeHistory The fee history to format
 * @returns An Effect that succeeds with the formatted fee history
 */
export function formatFeeHistory(feeHistory: FeeHistory): Effect.Effect<FeeHistoryJson, FormatFeeHistoryError, never> {
	return Effect.try({
		try: () => Ox.Fee.formatFeeHistory(feeHistory),
		catch: (cause) => new FormatFeeHistoryError(cause),
	})
}

/**
 * Error class for parseFeeHistory function
 */
export class ParseFeeHistoryError extends Error {
	override name = 'ParseFeeHistoryError'
	_tag = 'ParseFeeHistoryError'
	constructor(cause: unknown) {
		super('Failed to parse fee history with ox', {
			cause,
		})
	}
}

/**
 * Parses a fee history from JSON
 * @param feeHistoryJson The JSON fee history to parse
 * @returns An Effect that succeeds with the parsed fee history
 */
export function parseFeeHistory(
	feeHistoryJson: FeeHistoryJson,
): Effect.Effect<FeeHistory, ParseFeeHistoryError, never> {
	return Effect.try({
		try: () => Ox.Fee.parseFeeHistory(feeHistoryJson),
		catch: (cause) => new ParseFeeHistoryError(cause),
	})
}
