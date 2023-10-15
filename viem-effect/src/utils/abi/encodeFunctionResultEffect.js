import { encodeFunctionResult } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeFunctionResult, Error>}
 */
export const encodeFunctionResultEffect = wrapInEffect(encodeFunctionResult);