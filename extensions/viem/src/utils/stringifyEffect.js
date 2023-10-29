import { wrapInEffect } from '../wrapInEffect.js'
import { stringify } from 'viem/utils'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof stringify, import("viem/utils").StringifyErrorType>}
 */
export const stringifyEffect = wrapInEffect(stringify)
