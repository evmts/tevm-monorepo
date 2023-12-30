import { wrapInEffect } from '../../wrapInEffect.js'
import { fromHex } from 'viem/utils'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fromHex, import("viem/utils").FromHexErrorType>}
 */
export const fromHexEffect = wrapInEffect(fromHex)
