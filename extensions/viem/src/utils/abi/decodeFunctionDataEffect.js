import { wrapInEffect } from '../../wrapInEffect.js'
import { decodeFunctionData } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeFunctionData, import("viem/contract").DecodeFunctionDataErrorType>}
 */
export const decodeFunctionDataEffect = wrapInEffect(decodeFunctionData)
