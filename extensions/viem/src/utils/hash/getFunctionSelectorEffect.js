import { wrapInEffect } from '../../wrapInEffect.js'
import { getFunctionSelector } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFunctionSelector, import("viem/utils").GetFunctionSelectorErrorType>}
 */
export const getFunctionSelectorEffect = wrapInEffect(getFunctionSelector)
