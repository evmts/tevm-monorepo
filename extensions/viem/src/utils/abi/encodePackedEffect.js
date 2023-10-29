import { wrapInEffect } from '../../wrapInEffect.js'
import { encodePacked } from 'viem/abi'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodePacked, import("viem/abi").EncodePackedErrorType>}
 */
export const encodePackedEffect = wrapInEffect(encodePacked)
