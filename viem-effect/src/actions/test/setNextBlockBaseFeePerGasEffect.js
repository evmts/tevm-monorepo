import { setNextBlockBaseFeePerGas } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setNextBlockBaseFeePerGas, import("viem/actions").SetNextBlockBaseFeePerGasErrorType>}
 */
export const setNextBlockBaseFeePerGasEffect = wrapInEffect(setNextBlockBaseFeePerGas);