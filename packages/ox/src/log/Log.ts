import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type Log = Ox.Log.Log
export type LogJson = Ox.Log.LogJson

/**
 * Error class for assert function
 */
export class AssertError extends Error {
	override name = 'AssertError'
	_tag = 'AssertError'
	constructor(cause: unknown) {
		super('Unexpected error asserting Log with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Asserts if the given value is a valid Log
 */
export function assert(value: unknown): Effect.Effect<void, AssertError, never> {
	return Effect.try({
		try: () => Ox.Log.assert(value),
		catch: (cause) => new AssertError(cause),
	})
}

/**
 * Checks if the given value is a valid Log
 */
export function isLog(value: unknown): boolean {
	return Ox.Log.isLog(value)
}

/**
 * Validates the given value as a Log
 */
export function validate(value: unknown): boolean {
	return Ox.Log.validate(value)
}

/**
 * Error class for parse function
 */
export class ParseError extends Error {
	override name = 'ParseError'
	_tag = 'ParseError'
	constructor(cause: unknown) {
		super('Unexpected error parsing Log with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Parses raw log data from RPC response
 */
export function parse(log: LogJson): Effect.Effect<Log, ParseError, never> {
	return Effect.try({
		try: () => Ox.Log.parse(log),
		catch: (cause) => new ParseError(cause),
	})
}

/**
 * Error class for format function
 */
export class FormatError extends Error {
	override name = 'FormatError'
	_tag = 'FormatError'
	constructor(cause: unknown) {
		super('Unexpected error formatting Log with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Formats a Log object into a LogJson object
 */
export function format(log: Log): Effect.Effect<LogJson, FormatError, never> {
	return Effect.try({
		try: () => Ox.Log.format(log),
		catch: (cause) => new FormatError(cause),
	})
}

/**
 * Error class for create function
 */
export class CreateError extends Error {
	override name = 'CreateError'
	_tag = 'CreateError'
	constructor(cause: unknown) {
		super('Unexpected error creating Log with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Creates a new Log object from components
 */
export function create(options: {
	address: Ox.Address.Address
	blockHash?: Ox.Hex.Hex | Ox.Bytes.Bytes
	blockNumber?: bigint
	data?: Ox.Hex.Hex | Ox.Bytes.Bytes
	logIndex?: bigint
	removed?: boolean
	topics?: readonly (Ox.Hex.Hex | Ox.Bytes.Bytes)[]
	transactionHash?: Ox.Hex.Hex | Ox.Bytes.Bytes
	transactionIndex?: bigint
}): Effect.Effect<Log, CreateError, never> {
	return Effect.try({
		try: () => Ox.Log.create(options),
		catch: (cause) => new CreateError(cause),
	})
}
