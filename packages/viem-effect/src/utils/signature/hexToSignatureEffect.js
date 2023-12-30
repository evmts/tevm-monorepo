import { wrapInEffect } from '../../wrapInEffect.js'
import { hexToSignature } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof hexToSignature, import("viem").HexToSignatureErrorType>}
 */
export const hexToSignatureEffect = wrapInEffect(hexToSignature)
