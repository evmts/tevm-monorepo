import { wrapInEffect } from '../../wrapInEffect.js'
import { getEventSignature } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEventSignature, import("viem").GetEventSignatureErrorType>}
 */
export const getEventSignatureEffect = wrapInEffect(getEventSignature)
