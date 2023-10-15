import { getContract } from "viem";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof getContract, import("viem").GetContractErrorType>}
 */
export const getContractEffect = wrapInEffect(getContract);