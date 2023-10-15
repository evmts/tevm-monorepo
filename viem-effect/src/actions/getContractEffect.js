import { getContract } from "viem";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof getContract, Error>}
 */
export const getContractEffect = wrapInEffect(getContract);