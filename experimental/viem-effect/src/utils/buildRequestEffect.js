import { wrapInEffect } from '../wrapInEffect.js'
import { buildRequest } from 'viem/utils'

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof buildRequest, never>}
 */
export const buildRequestEffect = wrapInEffect(buildRequest)
