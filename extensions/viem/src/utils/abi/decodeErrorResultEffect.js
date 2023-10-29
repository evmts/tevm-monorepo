import { wrapInEffect } from '../../wrapInEffect.js'
import { decodeErrorResult } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeErrorResult, import("viem/contract").DecodeErrorResultErrorType>}
 */
export const decodeErrorResultEffect = wrapInEffect(decodeErrorResult)
