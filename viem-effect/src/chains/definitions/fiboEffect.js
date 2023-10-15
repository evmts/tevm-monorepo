import { fibo } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof fibo, Error>}
 */
export const fiboEffect = wrapInEffect(fibo);