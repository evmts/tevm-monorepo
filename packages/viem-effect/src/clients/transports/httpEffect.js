import { wrapInEffect } from '../../wrapInEffect.js'
import { http } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof http, never>}
 */
export const httpEffect = wrapInEffect(http)
