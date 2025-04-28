import { Effect } from 'effect'
import Ox from 'ox'

// Export types
export type AccessList = Ox.AccessList.AccessList
export type Item = Ox.AccessList.Item
export type ItemTuple = Ox.AccessList.ItemTuple
export type Tuple = Ox.AccessList.Tuple

/**
 * Error class for assert function
 */
export class AssertError extends Error {
	override name = 'AssertError'
	_tag = 'AssertError'
	constructor(cause: unknown) {
		super('Failed to assert AccessList with ox', {
			cause,
		})
	}
}

/**
 * Asserts that a value is a valid AccessList
 * @param value The value to check
 * @returns An Effect that succeeds with void if the value is valid, or fails with AssertError
 */
export function assert(value: unknown): Effect.Effect<void, AssertError, never> {
	return Effect.try({
		try: () => Ox.AccessList.assert(value),
		catch: (cause) => new AssertError(cause),
	})
}

/**
 * Error class for fromTupleList function
 */
export class FromTupleListError extends Error {
	override name = 'FromTupleListError'
	_tag = 'FromTupleListError'
	constructor(cause: unknown) {
		if (cause instanceof Ox.errors.InvalidStorageKeySizeError) {
			super(`Invalid storage key size: ${cause.message}`, { cause })
		} else {
			super('Failed to convert tuple list to AccessList with ox', {
				cause,
			})
		}
	}
}

/**
 * Converts a list of tuples to an AccessList
 * @param list The list of tuples to convert
 * @returns An Effect that succeeds with an AccessList
 */
export function fromTupleList(
	list: Ox.AccessList.Tuple,
): Effect.Effect<Ox.AccessList.AccessList, FromTupleListError, never> {
	return Effect.try({
		try: () => Ox.AccessList.fromTupleList(list),
		catch: (cause) => new FromTupleListError(cause),
	})
}

/**
 * Error class for toTupleList function
 */
export class ToTupleListError extends Error {
	override name = 'ToTupleListError'
	_tag = 'ToTupleListError'
	constructor(cause: unknown) {
		super('Failed to convert AccessList to tuple list with ox', {
			cause,
		})
	}
}

/**
 * Converts an AccessList to a list of tuples
 * @param list The AccessList to convert
 * @returns An Effect that succeeds with a tuple list
 */
export function toTupleList(
	list: Ox.AccessList.AccessList,
): Effect.Effect<Ox.AccessList.Tuple, ToTupleListError, never> {
	return Effect.try({
		try: () => Ox.AccessList.toTupleList(list),
		catch: (cause) => new ToTupleListError(cause),
	})
}

/**
 * Checks if a value is a valid AccessList
 * @param value The value to check
 * @returns An Effect that succeeds with a boolean indicating if the value is an AccessList
 */
export function isAccessList(value: unknown): Effect.Effect<boolean, never, never> {
	return Effect.succeed(Ox.AccessList.isAccessList(value))
}

/**
 * Validates an AccessList
 * @param value The value to validate
 * @returns An Effect that succeeds with a boolean indicating if the value is valid
 */
export function validate(value: unknown): Effect.Effect<boolean, never, never> {
	return Effect.succeed(Ox.AccessList.validate(value))
}
