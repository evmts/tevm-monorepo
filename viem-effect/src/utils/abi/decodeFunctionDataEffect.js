import { decodeFunctionData } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof decodeFunctionData, Error>}
 */
export const decodeFunctionDataEffect = wrapInEffect(decodeFunctionData);