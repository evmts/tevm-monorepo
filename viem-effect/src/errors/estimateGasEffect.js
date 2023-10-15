import { estimateGas } from "viem/actions";
import { wrapInEffect } from '../wrapInEffect.js';

/**
 * @type {import("../wrapInEffect.js").WrappedInEffect<typeof estimateGas, Error>}
 */
export const estimateGasEffect = wrapInEffect(estimateGas);