import { Effect } from 'effect'

/**
 * Wraps viem into an {@link https://www.effect.website/docs/essentials/effect-type Effect} version
 * The effect version will include the type of the expected errors viem would throw
 * @type {import("./wrapInEffect.js").WrapInEffect}
 * @example
 * ```ts
 * import {parseUnits} from 'viem/utils'
 * import {wrapViemAsync} from '@evmts/viem-effect'
 * const parseUnitsEffect = wrapViemAsync(parseUnits)
 * ````
 */
export const wrapInEffect = (viemFunction) => {
	return (...args) => {
		try {
			const res = viemFunction(...args)
			// check if a promise
			if (res && typeof res.then === 'function') {
				return Effect.promise(res)
			} else {
				return Effect.succeed(res)
			}
		} catch (e) {
			return Effect.fail(/** @type any */ (e))
		}
	}
}
