import { encodeFunctionResult } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeFunctionResult, import("viem/contract").EncodeFunctionResultErrorType>}
 */
export const encodeFunctionResultEffect = wrapInEffect(encodeFunctionResult);