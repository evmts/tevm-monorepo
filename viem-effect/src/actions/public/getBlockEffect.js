import { getBlock } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getBlock, import("viem/actions").GetBlockErrorType>}
 */
export const getBlockEffect = wrapInEffect(getBlock);