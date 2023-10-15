import { encodeFunctionData } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeFunctionData, import("viem/contract").EncodeFunctionDataErrorType>}
 */
export const encodeFunctionDataEffect = wrapInEffect(encodeFunctionData);