import { avalancheFuji } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof avalancheFuji, Error>}
 */
export const avalancheFujiEffect = wrapInEffect(avalancheFuji);