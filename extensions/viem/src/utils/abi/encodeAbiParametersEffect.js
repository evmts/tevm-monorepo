import { wrapInEffect } from '../../wrapInEffect.js'
import { encodeAbiParameters } from 'viem/abi'

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeAbiParameters, import("viem/abi").EncodeAbiParametersErrorType>}
 */
export const encodeAbiParametersEffect = wrapInEffect(encodeAbiParameters)
