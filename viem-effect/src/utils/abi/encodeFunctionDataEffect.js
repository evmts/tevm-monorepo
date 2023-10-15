import { encodeFunctionData } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof encodeFunctionData, Error>}
 */
export const encodeFunctionDataEffect = wrapInEffect(encodeFunctionData);