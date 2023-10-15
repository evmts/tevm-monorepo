import { decodeAbiParameters } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeAbiParameters, import("viem/abi").DecodeAbiParametersErrorType>}
 */
export const decodeAbiParametersEffect = wrapInEffect(decodeAbiParameters);