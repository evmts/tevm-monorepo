import { decodeAbiParameters } from "viem/abi";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeAbiParameters, Error>}
 */
export const decodeAbiParametersEffect = wrapInEffect(decodeAbiParameters);