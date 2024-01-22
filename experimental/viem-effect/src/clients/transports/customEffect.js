import { wrapInEffect } from '../../wrapInEffect.js'
import { custom } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof custom, never>}
 */
export const customEffect = wrapInEffect(custom)
