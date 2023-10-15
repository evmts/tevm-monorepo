import { getBlockNumber } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getBlockNumber, import("viem/actions").GetBlockNumberErrorType>}
 */
export const getBlockNumberEffect = wrapInEffect(getBlockNumber);