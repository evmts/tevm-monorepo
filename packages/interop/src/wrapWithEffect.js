import { Effect } from 'effect'

/**
 * Wrap an existing object instance with Effect methods.
 *
 * This maintains backward compatibility while adding an Effect-based API.
 * The original methods remain unchanged, and a new `.effect` property is added
 * containing Effect-wrapped versions of the specified methods.
 *
 * Note: The wrapped Effect methods have an error type of `unknown` since
 * the original Promise-based methods may reject with any error type.
 *
 * @example
 * ```typescript
 * import { wrapWithEffect } from '@tevm/interop'
 * import { Effect } from 'effect'
 *
 * class StateManager {
 *   async getAccount(address: string) { return { balance: 100n } }
 *   async putAccount(address: string, account: any) { }
 * }
 *
 * const stateManager = new StateManager()
 * const wrappedManager = wrapWithEffect(stateManager, ['getAccount', 'putAccount'])
 *
 * // Original API still works
 * const account1 = await wrappedManager.getAccount('0x...')
 *
 * // New Effect API available
 * const program = Effect.gen(function* () {
 *   const account2 = yield* wrappedManager.effect.getAccount('0x...')
 *   return account2
 * })
 * ```
 *
 * @template T - The type of the object to wrap
 * @param {T} instance - The object instance to wrap
 * @param {(keyof T)[]} methods - Array of method names to wrap with Effect
 * @returns {T & { effect: Record<string, (...args: unknown[]) => Effect.Effect<unknown, unknown, never>> }} The original object with an added `.effect` property
 * @throws {Error} Throws if any specified method does not exist on the instance or is not a function
 */
export const wrapWithEffect = (instance, methods) => {
	/** @type {Record<string, (...args: unknown[]) => Effect.Effect<unknown, unknown, never>>} */
	const effectMethods = {}

	for (const method of methods) {
		const fn = instance[method]
		if (fn === undefined) {
			throw new Error(`Method '${String(method)}' does not exist on instance`)
		}
		if (typeof fn !== 'function') {
			throw new Error(`Property '${String(method)}' is not a function`)
		}
		effectMethods[/** @type {string} */ (method)] = (...args) =>
			Effect.tryPromise(() => /** @type {Function} */ (fn).apply(instance, args))
	}

	return Object.assign(instance, { effect: effectMethods })
}
