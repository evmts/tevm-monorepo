import { wrapInEffect } from '../../wrapInEffect.js'
import { decodeAbiParameters } from 'viem/abi'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeAbiParameters, import("viem/abi").DecodeAbiParametersErrorType>}
 */
export const decodeAbiParametersEffect = wrapInEffect(decodeAbiParameters)
