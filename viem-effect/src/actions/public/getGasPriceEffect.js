import { getGasPrice } from "viem/actions";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof getGasPrice, import("viem/actions").GetGasPriceErrorType>}
 */
export const getGasPriceEffect = wrapInEffect(getGasPrice);