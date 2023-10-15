import { wanchain } from "viem/chains";
import { wrapInEffect } from '../../wrapInEffect.js';

/**
 * @type {import("../../wrapInEffect.js").WrappedInEffect<typeof wanchain, Error>}
 */
export const wanchainEffect = wrapInEffect(wanchain);