import { estimateGas } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof estimateGas, import("viem/actions").EstimateGasErrorType>}
 */
export const estimateGasEffect = wrapInEffect(estimateGas);