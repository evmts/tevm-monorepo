import { decodeFunctionResult } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeFunctionResult, import("viem/contract").DecodeFunctionResultErrorType>}
 */
export const decodeFunctionResultEffect = wrapInEffect(decodeFunctionResult);