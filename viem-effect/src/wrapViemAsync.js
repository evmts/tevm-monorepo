import { Effect } from "effect"


// TODO replace jsdoc with an actual async function once used!!!
/**
 * Wraps viem into an {@link https://www.effect.website/docs/essentials/effect-type Effect} version
 * The effect version will include the type of the expected errors viem would throw
 * @type {import("./wrapViemAsync.d.js").WrapViemAsync}
 * @example
 * ```ts
 * import {parseUnits} from 'viem/utils'
 * import {wrapViemAsync} from '@evmts/viem-effect'
 * const parseUnitsEffect = wrapViemAsync(parseUnits)
 * ````
 */
export const wrapViemAsync = (viemFunction) => {
  return (...args) => {
    const out = /** @type any */(Effect.promise(() => viemFunction(...args)))
    return out
  }
}

