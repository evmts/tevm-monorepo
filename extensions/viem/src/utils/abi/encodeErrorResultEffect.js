import { wrapInEffect } from '../../wrapInEffect.js'
import { encodeErrorResult } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeErrorResult, import("viem/contract").EncodeErrorResultErrorType>}
 */
export const encodeErrorResultEffect = wrapInEffect(encodeErrorResult)
