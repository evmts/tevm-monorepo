import { wrapInEffect } from '../../wrapInEffect.js'
import { getFunctionSignature } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getFunctionSignature, import("viem").GetFunctionSignatureErrorType>}
 */
export const getFunctionSignatureEffect = wrapInEffect(getFunctionSignature)
