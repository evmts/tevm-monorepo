import { encodeAbiParameters } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeAbiParameters, Error>}
 */
export const encodeAbiParametersEffect = wrapInEffect(encodeAbiParameters);