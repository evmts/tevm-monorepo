import { Effect } from 'effect'

/**
 * Wrap an existing object instance with Effect methods.
 *
 * This maintains backward compatibility while adding an Effect-based API.
 * The original methods remain unchanged, and a new `.effect` property is added
 * containing Effect-wrapped versions of the specified methods.
 *
 * **IMPORTANT**: This function returns a NEW object - it does NOT mutate the original
 * instance. This ensures immutability and prevents unexpected side effects for callers
 * who may not expect their original object to be modified.
 *
 * **Prototype chain preservation**: This function properly preserves the prototype chain
 * of the original instance. Prototype methods (like those defined on a class) will be
 * accessible on the wrapped object. Getters and setters are also preserved correctly.
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
 *
 * // Original instance is NOT modified
 * console.log(stateManager.effect) // undefined
 * console.log(wrappedManager.effect) // { getAccount: ..., putAccount: ... }
 * ```
 *
 * @template T - The type of the object to wrap
 * @param {T} instance - The object instance to wrap (will NOT be mutated)
 * @param {(keyof T)[]} methods - Array of method names to wrap with Effect
 * @returns {T & { effect: Record<string, (...args: unknown[]) => Effect.Effect<unknown, unknown, never>> }} A new object with all original properties plus an `.effect` property
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

	// Create a new object that preserves the prototype chain
	// This ensures prototype methods (class methods) are accessible on the wrapped object
	const wrapped = Object.create(Object.getPrototypeOf(instance))

	// Copy all own property descriptors from the instance to preserve getters/setters
	const descriptors = Object.getOwnPropertyDescriptors(instance)
	Object.defineProperties(wrapped, descriptors)

	// Add the effect methods
	Object.defineProperty(wrapped, 'effect', {
		value: effectMethods,
		writable: false,
		enumerable: true,
		configurable: false,
	})

	return /** @type {T & { effect: Record<string, (...args: unknown[]) => Effect.Effect<unknown, unknown, never>> }} */ (
		wrapped
	)
}
