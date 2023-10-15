import { decodeFunctionResult } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeFunctionResult, Error>}
 */
export const decodeFunctionResultEffect = wrapInEffect(decodeFunctionResult);