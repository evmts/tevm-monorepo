import { Effect } from 'effect'
import Ox from 'ox'

// Re-export types
export type AccessList = Ox.AccessList.AccessList

/**
 * Error thrown when asserting an invalid access list
 */
export class AssertError extends Error {
	override name = 'AssertError'
	_tag = 'AssertError'
	constructor(cause: unknown) {
		super('Invalid access list format when asserting with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Asserts that a value is a valid AccessList
 *
 * @param value - The value to assert
 * @returns Effect that succeeds with void if the value is valid, or fails with AssertError if invalid
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as AccessList from '@tevm/ox/accessList'
 *
 * const validAccessList = [
 *   {
 *     address: '0x1234567890123456789012345678901234567890',
 *     storageKeys: [
 *       '0x0000000000000000000000000000000000000000000000000000000000000001',
 *       '0x0000000000000000000000000000000000000000000000000000000000000002',
 *     ],
 *   },
 * ]
 *
 * const program = AccessList.assert(validAccessList)
 * await Effect.runPromise(program) // Succeeds with void
 * ```
 */
export function assert(value: unknown): Effect.Effect<void, AssertError, never> {
	return Effect.try({
		try: () => {
			Ox.AccessList.assert(value)
		},
		catch: (cause) => new AssertError(cause),
	})
}

/**
 * Checks if a value is a valid AccessList
 *
 * @param value - The value to check
 * @returns Effect that succeeds with a boolean indicating if the value is a valid AccessList
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as AccessList from '@tevm/ox/accessList'
 *
 * const validAccessList = [
 *   {
 *     address: '0x1234567890123456789012345678901234567890',
 *     storageKeys: [
 *       '0x0000000000000000000000000000000000000000000000000000000000000001',
 *       '0x0000000000000000000000000000000000000000000000000000000000000002',
 *     ],
 *   },
 * ]
 *
 * const program = AccessList.isAccessList(validAccessList)
 * const result = await Effect.runPromise(program) // true
 * ```
 */
export function isAccessList(value: unknown): Effect.Effect<boolean, never, never> {
	return Effect.succeed(Ox.AccessList.isAccessList(value))
}

/**
 * Validates if a value matches the AccessList format
 *
 * @param value - The value to validate
 * @returns Effect that succeeds with a boolean indicating if the value matches the AccessList format
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as AccessList from '@tevm/ox/accessList'
 *
 * const validAccessList = [
 *   {
 *     address: '0x1234567890123456789012345678901234567890',
 *     storageKeys: [
 *       '0x0000000000000000000000000000000000000000000000000000000000000001',
 *       '0x0000000000000000000000000000000000000000000000000000000000000002',
 *     ],
 *   },
 * ]
 *
 * const program = AccessList.validate(validAccessList)
 * const result = await Effect.runPromise(program) // true
 * ```
 */
export function validate(value: unknown): Effect.Effect<boolean, never, never> {
	return Effect.succeed(Ox.AccessList.validate(value))
}
