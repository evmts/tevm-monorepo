import { wrapInEffect } from '../../wrapInEffect.js'
import { decodeFunctionResult } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeFunctionResult, import("viem/contract").DecodeFunctionResultErrorType>}
 */
export const decodeFunctionResultEffect = wrapInEffect(decodeFunctionResult)
