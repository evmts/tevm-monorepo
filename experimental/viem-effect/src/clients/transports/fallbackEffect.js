import { wrapInEffect } from '../../wrapInEffect.js'
import { fallback } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fallback, never>}
 */
export const fallbackEffect = wrapInEffect(fallback)
