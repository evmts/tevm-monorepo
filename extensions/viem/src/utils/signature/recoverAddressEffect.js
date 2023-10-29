import { wrapInEffect } from '../../wrapInEffect.js'
import { recoverAddress } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverAddress, import("viem/utils").RecoverAddressErrorType>}
 */
export const recoverAddressEffect = wrapInEffect(recoverAddress)
