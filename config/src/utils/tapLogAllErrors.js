import { all, logError, tapError } from 'effect/Effect'

/**
 * Logs all errors and causes from effect
 * @type {() => <R, A>(self: import("effect/Effect").Effect<R, any, A>) => import("effect/Effect").Effect<R, any, A>}
 * @internal
 */
export const tapLogAllErrors = () =>
	tapError((e) => {
		const errors = /** @type {Array<unknown>} */ ([])
		let nextError = e
		while (nextError.cause) {
			errors.unshift(nextError.cause)
			nextError = /** @type {any} */ (nextError.cause)
		}
		if (e.cause) {
			errors.push(e.cause)
		}
		errors.push(e.message)
		return all(errors.map((e) => logError(e)))
	})
