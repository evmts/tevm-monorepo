import { decodeDeployData } from "viem";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeDeployData, import("viem").DecodeDeployDataErrorType>}
 */
export const decodeDeployDataEffect = wrapInEffect(decodeDeployData);