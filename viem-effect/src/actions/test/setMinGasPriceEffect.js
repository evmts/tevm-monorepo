import { setMinGasPrice } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof setMinGasPrice, import("viem/actions").SetMinGasPriceErrorType>}
 */
export const setMinGasPriceEffect = wrapInEffect(setMinGasPrice);