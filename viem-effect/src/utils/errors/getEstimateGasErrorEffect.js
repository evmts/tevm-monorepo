import { getEstimateGasError } from "viem/utils";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getEstimateGasError, Error>}
 */
export const getEstimateGasErrorEffect = wrapInEffect(getEstimateGasError);