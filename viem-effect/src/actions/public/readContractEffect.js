import { readContract } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof readContract, import("viem/actions").ReadContractErrorType>}
 */
export const readContractEffect = wrapInEffect(readContract);