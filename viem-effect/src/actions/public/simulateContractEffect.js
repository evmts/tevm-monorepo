import { simulateContract } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof simulateContract, import("viem/actions").SimulateContractErrorType>}
 */
export const simulateContractEffect = wrapInEffect(simulateContract);