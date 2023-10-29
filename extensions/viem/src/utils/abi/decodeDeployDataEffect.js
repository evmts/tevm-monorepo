import { wrapInEffect } from '../../wrapInEffect.js'
import { decodeDeployData } from 'viem'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeDeployData, import("viem").DecodeDeployDataErrorType>}
 */
export const decodeDeployDataEffect = wrapInEffect(decodeDeployData)
