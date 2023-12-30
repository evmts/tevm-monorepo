import { wrapInEffect } from '../../wrapInEffect.js'
import { encodeFunctionData } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeFunctionData, import("viem/contract").EncodeFunctionDataErrorType>}
 */
export const encodeFunctionDataEffect = wrapInEffect(encodeFunctionData)
