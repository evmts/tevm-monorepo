import { Effect } from "effect"


/**
 * Wraps viem into an {@link https://www.effect.website/docs/essentials/effect-type Effect} version
 * The effect version will include the type of the expected errors viem would throw
 * @type import("./wrapViemSync.d.js").WrapViemSync
 * @example
 * ```ts
 * import {parseUnits} from 'viem/utils'
 * import {wrapViemSync} from '@evmts/viem-effect'
 * const parseUnitsEffect = wrapViemSync(parseUnits)
 * ````
 */
export const wrapViemSync = (viemFunction) => {
  return (...args) => {
    try {
      const out = /** @type any */(Effect.succeed(viemFunction(...args)))
      return out
    } catch (e) {
      return Effect.fail(e)
    }
  }
}

