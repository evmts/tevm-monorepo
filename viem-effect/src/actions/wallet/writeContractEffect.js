import { writeContract } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof writeContract, import("viem/actions").WriteContractErrorType>}
 */
export const writeContractEffect = wrapInEffect(writeContract);