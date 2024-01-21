import { wrapInEffect } from '../../wrapInEffect.js'
import { verifyTypedData } from 'viem/actions'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof verifyTypedData, import("viem/actions").VerifyTypedDataErrorType>}
 */
export const verifyTypedDataEffect = wrapInEffect(verifyTypedData)
