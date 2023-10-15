import { deployContract } from "viem/contract";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof deployContract, import("viem/contract").DeployContractErrorType>}
 */
export const deployContractEffect = wrapInEffect(deployContract);