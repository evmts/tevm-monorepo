import { encodeAbiParameters } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeAbiParameters, import("viem/abi").EncodeAbiParametersErrorType>}
 */
export const encodeAbiParametersEffect = wrapInEffect(encodeAbiParameters);