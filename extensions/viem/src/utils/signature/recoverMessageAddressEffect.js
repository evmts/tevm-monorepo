import { wrapInEffect } from '../../wrapInEffect.js'
import { recoverMessageAddress } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverMessageAddress, import("viem/utils").RecoverMessageAddressErrorType>}
 */
export const recoverMessageAddressEffect = wrapInEffect(recoverMessageAddress)
