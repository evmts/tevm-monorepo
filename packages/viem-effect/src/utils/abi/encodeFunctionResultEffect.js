import { wrapInEffect } from '../../wrapInEffect.js'
import { encodeFunctionResult } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeFunctionResult, import("viem/contract").EncodeFunctionResultErrorType>}
 */
export const encodeFunctionResultEffect = wrapInEffect(encodeFunctionResult)
