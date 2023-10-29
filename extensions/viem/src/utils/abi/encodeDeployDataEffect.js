import { wrapInEffect } from '../../wrapInEffect.js'
import { encodeDeployData } from 'viem/contract'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeDeployData, import("viem/contract").EncodeDeployDataErrorType>}
 */
export const encodeDeployDataEffect = wrapInEffect(encodeDeployData)
