import { estimateMaxPriorityFeePerGas } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof estimateMaxPriorityFeePerGas, import("viem/actions").EstimateMaxPriorityFeePerGasErrorType>}
 */
export const estimateMaxPriorityFeePerGasEffect = wrapInEffect(estimateMaxPriorityFeePerGas);