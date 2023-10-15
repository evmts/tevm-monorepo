import { estimateFeesPerGas } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof estimateFeesPerGas, import("viem/actions").EstimateFeesPerGasErrorType>}
 */
export const estimateFeesPerGasEffect = wrapInEffect(estimateFeesPerGas);