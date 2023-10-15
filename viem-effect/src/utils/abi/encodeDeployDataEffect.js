import { encodeDeployData } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeDeployData, import("viem/contract").EncodeDeployDataErrorType>}
 */
export const encodeDeployDataEffect = wrapInEffect(encodeDeployData);