import { estimateContractGas } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof estimateContractGas, import("viem/actions").EstimateContractGasErrorType>}
 */
export const estimateContractGasEffect = wrapInEffect(estimateContractGas);