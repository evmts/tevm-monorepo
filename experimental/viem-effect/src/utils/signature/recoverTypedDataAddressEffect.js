import { wrapInEffect } from '../../wrapInEffect.js'
import { recoverTypedDataAddress } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof recoverTypedDataAddress, import("viem/utils").RecoverTypedDataAddressErrorType>}
 */
export const recoverTypedDataAddressEffect = wrapInEffect(
	recoverTypedDataAddress,
)
