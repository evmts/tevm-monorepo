import { all, logError } from 'effect/Effect'

/**
 * Logs all errors and causes from effect
 * @param {unknown} e
 * @returns {import("effect/Effect").Effect<never, never, void>}
 * @internal
 * @example
 * ```typescript
 * import { logAllErrors } from '@eth-optimism/config'
 *
 * someEffect.pipe(
 *   tapError(logAllErrors)
 * )
 */
export const logAllErrors = (e) => {
	const errors = [e]
	let nextError = /** @type {Error} */ (e)
	while (nextError.cause) {
		errors.unshift(nextError.cause)
		nextError = /** @type {Error} */ (nextError.cause)
	}
	return all(errors.map((e) => logError(e)))
}
