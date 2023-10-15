import { setBlockGasLimit } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setBlockGasLimit, import("viem/actions").SetBlockGasLimitErrorType>}
 */
export const setBlockGasLimitEffect = wrapInEffect(setBlockGasLimit);